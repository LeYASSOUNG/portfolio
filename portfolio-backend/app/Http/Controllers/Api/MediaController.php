<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    /**
     * Lister les fichiers et dossiers dans un chemin donné.
     */
    public function index(Request $request)
    {
        $folder = $request->query('folder', 'uploads');
        // Prevent path traversal
        $folder = str_replace('..', '', $folder);
        if (!str_starts_with($folder, 'uploads')) {
            $folder = 'uploads';
        }

        $directories = Storage::disk('public')->directories($folder);
        $files = Storage::disk('public')->files($folder);

        $media = [];

        // Add directories
        foreach ($directories as $dir) {
            $media[] = [
                'name' => basename($dir),
                'path' => $dir,
                'type' => 'folder',
                'url' => null,
                'size' => 0,
                'modified' => Storage::disk('public')->lastModified($dir),
            ];
        }

        // Add files
        foreach ($files as $file) {
            $media[] = [
                'name'     => basename($file),
                'path'     => $file,
                'type'     => 'file',
                'url'      => asset('storage/' . $file),
                'size'     => Storage::disk('public')->size($file),
                'modified' => Storage::disk('public')->lastModified($file),
            ];
        }

        return response()->json($media);
    }

    /**
     * Créer un nouveau dossier.
     */
    public function createFolder(Request $request)
    {
        $request->validate(['folder' => 'required|string', 'name' => 'required|string']);
        $parent = $request->input('folder');
        $parent = str_replace('..', '', $parent);
        if (!str_starts_with($parent, 'uploads')) $parent = 'uploads';

        $name = Str::slug($request->input('name'));
        $path = $parent . '/' . $name;
        
        Storage::disk('public')->makeDirectory($path);
        
        return response()->json(['message' => 'Dossier créé.']);
    }

    /**
     * Uploader un fichier média.
     */
    public function store(Request $request)
    {
        $request->validate([
            // Liste blanche : images, PDF et vidéos uniquement (pas de PHP/HTML/SVG exécutables)
            'file' => 'required|file|max:10240|mimes:jpg,jpeg,png,gif,webp,avif,pdf,mp4,webm',
            'folder' => 'nullable|string'
        ]);

        $folder = $request->input('folder', 'uploads');
        $folder = str_replace('..', '', $folder);
        if (!str_starts_with($folder, 'uploads')) $folder = 'uploads';

        $file = $request->file('file');
        // Extension déduite du contenu réel (MIME), jamais du nom fourni par le client
        $extension = $file->guessExtension();
        if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'pdf', 'mp4', 'webm'], true)) {
            return response()->json(['message' => 'Type de fichier non autorisé.'], 422);
        }
        $filename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '_' . time() . '.' . $extension;

        $path = $file->storeAs($folder, $filename, 'public');

        return response()->json([
            'name' => $filename,
            'path' => $path,
            'type' => 'file',
            'url'  => asset('storage/' . $path),
            'size' => Storage::disk('public')->size($path),
        ], 201);
    }

    /**
     * Supprimer un fichier ou un dossier média.
     */
    public function destroy(Request $request)
    {
        $path = $request->query('path');
        $path = str_replace('..', '', $path);
        if (!$path || !str_starts_with($path, 'uploads')) {
             return response()->json(['message' => 'Chemin invalide.'], 400);
        }

        if (Storage::disk('public')->exists($path)) {
            // Is it a directory? The file extension check or directory exists
            if (is_dir(Storage::disk('public')->path($path))) {
                Storage::disk('public')->deleteDirectory($path);
            } else {
                Storage::disk('public')->delete($path);
            }
            return response()->json(['message' => 'Supprimé avec succès.']);
        }
        
        // Sometimes exists() fails for directories, use deleteDirectory unconditionally
        Storage::disk('public')->deleteDirectory($path);

        return response()->json(['message' => 'Supprimé avec succès.']);
    }
}
