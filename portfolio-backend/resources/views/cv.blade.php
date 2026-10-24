<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>CV - Diarrassouba Yassoungo</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #333;
            line-height: 1.5;
            margin: 0;
            padding: 20px;
        }
        h1, h2, h3 {
            color: #1f2937;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            color: #4f46e5;
        }
        .header p {
            margin: 5px 0;
            font-size: 16px;
            color: #4b5563;
        }
        .contact-info {
            font-size: 14px;
            color: #6b7280;
            margin-top: 10px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section h2 {
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 5px;
            font-size: 20px;
            color: #374151;
            text-transform: uppercase;
        }
        .item {
            margin-bottom: 15px;
        }
        .item-title {
            font-weight: bold;
            font-size: 16px;
            color: #111827;
        }
        .item-date {
            font-size: 14px;
            color: #6b7280;
            float: right;
        }
        .item-subtitle {
            font-style: italic;
            color: #4b5563;
            margin-bottom: 5px;
        }
        .item-desc {
            font-size: 14px;
            color: #4b5563;
        }
        .skills-container {
            width: 100%;
        }
        .skill-item {
            display: inline-block;
            width: 48%;
            margin-bottom: 8px;
            font-size: 14px;
        }
        .skill-name {
            font-weight: bold;
        }
        .skill-level {
            color: #6b7280;
        }
        .clear {
            clear: both;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>YASSOUNGO YOUSSOUF DIARRASSOUBA</h1>
        <p>Développeur Full Stack & Créateur d'Expériences Numériques</p>
        <div class="contact-info">
            +225 07 49 67 90 02 | +225 01 52 52 26 28<br>
            diarrassoubayassoungo33@gmail.com | Côte d'Ivoire
        </div>
    </div>

    <div class="section">
        <h2>Profil</h2>
        <p class="item-desc">
            Passionné par le développement web et la création d'interfaces innovantes. J'accompagne les entreprises et les particuliers dans la transformation de leurs idées en solutions numériques performantes, modernes et évolutives.
        </p>
    </div>

    <div class="section">
        <h2>Expériences Professionnelles</h2>
        @foreach($experiences as $exp)
        <div class="item">
            <div>
                <span class="item-title">{{ $exp->role }}</span>
                <span class="item-date">{{ $exp->duration }}</span>
                <div class="clear"></div>
            </div>
            <div class="item-subtitle">{{ $exp->company }}</div>
            <div class="item-desc">{{ $exp->description }}</div>
        </div>
        @endforeach
    </div>

    <div class="section">
        <h2>Compétences Techniques</h2>
        <div class="skills-container">
            @foreach($skills as $skill)
            <div class="skill-item">
                <span class="skill-name">{{ $skill->name }}</span>
                <span class="skill-level">({{ $skill->level }}%) - {{ $skill->category ?? 'Tech' }}</span>
            </div>
            @endforeach
        </div>
    </div>

    <div class="section">
        <h2>Formations</h2>
        <div class="item">
            <div>
                <span class="item-title">Licence MIAGE</span>
                <span class="item-date">2023 - Présent</span>
                <div class="clear"></div>
            </div>
            <div class="item-subtitle">Université Polytechnique de Bingerville (UPB)</div>
        </div>
    </div>

</body>
</html>
