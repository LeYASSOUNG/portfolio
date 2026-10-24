import { Component, computed, signal, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { ApiService } from '../../services/api.service';

type Direction = { r: number; c: number };
type CellPos = { r: number; c: number };
type BoardCell = {
  letter: string;
  selected: boolean;
  found: boolean;
};

type Placement = { row: number; col: number; dir: Direction };

type WordItem = {
  word: string;
  found: boolean;
};


const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIRECTIONS: Direction[] = [
  { r: 0, c: 1 },
  { r: 0, c: -1 },
  { r: 1, c: 0 },
  { r: -1, c: 0 },
  { r: 1, c: 1 },
  { r: -1, c: -1 },
  { r: 1, c: -1 },
  { r: -1, c: 1 },
];

@Component({
  selector: 'app-mini-game',
  standalone: true,
  templateUrl: './mini-game.html',
  styleUrl: './mini-game.css',
})
export class MiniGame implements OnInit {
  sourceWords: string[] = [];

  board = signal<BoardCell[][]>([]);
  words = signal<WordItem[]>([]);
  message = signal('');

  difficulty = signal<'easy' | 'medium' | 'hard'>('easy');
  
  gridSize = computed(() => {
    switch(this.difficulty()) {
      case 'easy': return 10;
      case 'medium': return 12;
      case 'hard': return 15;
    }
  });

  wordCount = computed(() => {
    switch(this.difficulty()) {
      case 'easy': return 5;
      case 'medium': return 8;
      case 'hard': return 12;
    }
  });

  allowedDirections = computed(() => {
    switch(this.difficulty()) {
      case 'easy': 
        return [ { r: 0, c: 1 }, { r: 1, c: 0 } ];
      case 'medium':
        return [ { r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: -1, c: 1 } ];
      case 'hard':
        return DIRECTIONS;
    }
  });
  
  leaderboard = signal<any[]>([]);
  playerName = signal('');
  gameSaved = signal(false);
  startTime: number = 0;
  timeTaken = signal(0);

  private startCell: CellPos | null = null;

  foundCount = computed(() => this.words().filter((w) => w.found).length);
  totalCount = computed(() => this.words().length);
  isCompleted = computed(() => this.foundCount() === this.totalCount() && this.totalCount() > 0);

  constructor(
    public translation: TranslationService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.fetchLeaderboard();
    this.apiService.getSettings().subscribe(settings => {
      if (settings && settings['game_words']) {
        this.sourceWords = settings['game_words'].split(',').map((w: string) => w.trim().toUpperCase()).filter((w: string) => w);
      } else {
        this.sourceWords = ['JAVASCRIPT', 'PYTHON', 'JAVA', 'RUST', 'KOTLIN', 'SWIFT'];
      }
      this.newGame();
    });
  }

  fetchLeaderboard() {
    this.apiService.getScores().subscribe(data => this.leaderboard.set(data));
  }

  newGame(): void {
    const generated = this.generateBoard();
    this.board.set(generated.board);
    this.words.set(generated.words.map((word) => ({ word, found: false })));
    this.message.set(this.translation.translate('game.ready'));
    this.startCell = null;
    
    this.startTime = Date.now();
    this.gameSaved.set(false);
    this.timeTaken.set(0);
    this.playerName.set('');
  }

  setDifficulty(level: 'easy' | 'medium' | 'hard') {
    this.difficulty.set(level);
    this.newGame();
  }

  rowTrackBy(index: number): number {
    return index;
  }

  cellTrackBy(index: number): number {
    return index;
  }

  onCellClick(r: number, c: number): void {
    if (!this.startCell) {
      this.startCell = { r, c };
      this.message.set(this.translation.translate('game.pick_end'));
      this.highlightCells([{ r, c }]);
      return;
    }

    const end = { r, c };
    const path = this.getLinePath(this.startCell, end);
    if (path.length === 0) {
      this.clearSelection();
      this.message.set(this.translation.translate('game.invalid_line'));
      return;
    }

    const letters = path.map((p) => this.board()[p.r][p.c].letter).join('');
    const reversed = letters.split('').reverse().join('');
    const target = this.words().find((w) => !w.found && (w.word === letters || w.word === reversed));

    if (target) {
      this.markFound(path, target.word);
      this.message.set(this.translation.translate('game.word_found').replace('{word}', target.word));
      if (this.isCompleted()) {
        this.message.set(this.translation.translate('game.completed'));
        this.timeTaken.set(Math.floor((Date.now() - this.startTime) / 1000));
      }
    } else {
      this.highlightCells(path);
      setTimeout(() => this.clearSelection(), 450);
      this.message.set(this.translation.translate('game.not_word'));
    }

    this.startCell = null;
  }

  saveScore() {
    if (!this.playerName()) return;
    const scoreData = {
      player_name: this.playerName(),
      score: this.foundCount(),
      time_taken: this.timeTaken()
    };
    this.apiService.saveScore(scoreData).subscribe(() => {
      this.gameSaved.set(true);
      this.fetchLeaderboard();
    });
  }

  updatePlayerName(event: any) {
    this.playerName.set(event.target.value);
  }

  clearSelection(): void {
    const board = this.board().map((row) => row.map((cell) => ({ ...cell, selected: false })));
    this.board.set(board);
    this.startCell = null;
  }

  private highlightCells(path: CellPos[]): void {
    const board = this.board().map((row) => row.map((cell) => ({ ...cell, selected: false })));
    for (const p of path) {
      board[p.r][p.c].selected = true;
    }
    this.board.set(board);
  }

  private markFound(path: CellPos[], word: string): void {
    const nextWords = this.words().map((w) => (w.word === word ? { ...w, found: true } : w));
    this.words.set(nextWords);

    const board = this.board().map((row) => row.map((cell) => ({ ...cell, selected: false })));
    for (const p of path) {
      board[p.r][p.c].found = true;
    }
    this.board.set(board);
  }

  private getLinePath(start: CellPos, end: CellPos): CellPos[] {
    const dr = end.r - start.r;
    const dc = end.c - start.c;

    const absR = Math.abs(dr);
    const absC = Math.abs(dc);

    if (!(dr === 0 || dc === 0 || absR === absC)) {
      return [];
    }

    const stepR = dr === 0 ? 0 : dr / absR;
    const stepC = dc === 0 ? 0 : dc / absC;
    const len = Math.max(absR, absC);

    const path: CellPos[] = [];
    for (let i = 0; i <= len; i++) {
      path.push({ r: start.r + stepR * i, c: start.c + stepC * i });
    }
    return path;
  }

  private generateBoard(): { board: BoardCell[][]; words: string[] } {
    const size = this.gridSize();
    const board: string[][] = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => '')
    );
    let availableWords = [...this.sourceWords].sort(() => Math.random() - 0.5);
    
    // Pour ne garder que ceux qui rentrent
    availableWords = availableWords.filter(w => w.length <= size);
    
    const words = availableWords.slice(0, this.wordCount());

    for (const word of words) {
      this.tryPlaceWord(board, word);
    }

    this.fillRandomLetters(board);

    return {
      words,
      board: board.map((row) => row.map((letter) => ({ letter, selected: false, found: false }))),
    };
  }

  private fillRandomLetters(board: string[][]): void {
    const size = this.gridSize();
    const totalCells = size * size;
    for (let i = 0; i < totalCells; i++) {
      const r = Math.floor(i / size);
      const c = i % size;
      if (!board[r][c]) {
        board[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }
  }

  private tryPlaceWord(board: string[][], word: string): void {
    if (this.tryPlaceWordRandomly(board, word)) return;
    this.tryPlaceWordFallback(board, word);
  }

  private tryPlaceWordRandomly(board: string[][], word: string): boolean {
    const MAX_TRIES = 250;
    const size = this.gridSize();
    const dirs = this.allowedDirections();
    for (let tries = 0; tries < MAX_TRIES; tries++) {
      const placement = {
        dir: dirs[Math.floor(Math.random() * dirs.length)],
        row: Math.floor(Math.random() * size),
        col: Math.floor(Math.random() * size),
      };

      if (this.canPlaceWord(board, word, placement)) {
        this.placeWord(board, word, placement);
        return true;
      }
    }
    return false;
  }

  private tryPlaceWordFallback(board: string[][], word: string): void {
    const size = this.gridSize();
    const maxCols = size - word.length + 1;
    if (maxCols <= 0) return;
    const totalCells = size * maxCols;
    for (let i = 0; i < totalCells; i++) {
      const r = Math.floor(i / maxCols);
      const c = i % maxCols;
      const placement = { row: r, col: c, dir: { r: 0, c: 1 } };
      if (this.canPlaceWord(board, word, placement)) {
        this.placeWord(board, word, placement);
        return;
      }
    }
  }

  private canPlaceWord(board: string[][], word: string, placement: Placement): boolean {
    const { row, col, dir } = placement;
    const size = this.gridSize();
    for (let i = 0; i < word.length; i++) {
      const rr = row + dir.r * i;
      const cc = col + dir.c * i;
      if (rr < 0 || rr >= size || cc < 0 || cc >= size) return false;
      const current = board[rr][cc];
      if (current && current !== word[i]) return false;
    }
    return true;
  }

  private placeWord(board: string[][], word: string, placement: Placement): void {
    const { row, col, dir } = placement;
    for (let i = 0; i < word.length; i++) {
      const rr = row + dir.r * i;
      const cc = col + dir.c * i;
      board[rr][cc] = word[i];
    }
  }
}
