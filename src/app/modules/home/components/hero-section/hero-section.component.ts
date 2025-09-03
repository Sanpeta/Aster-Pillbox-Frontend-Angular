import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
	AfterViewInit,
	Component,
	ElementRef,
	inject,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
	signal,
	ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-hero-section',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './hero-section.component.html',
	styleUrls: ['./hero-section.component.css'],
	animations: [
		trigger('fadeInUp', [
			transition(':enter', [
				style({ opacity: 0, transform: 'translateY(20px)' }),
				animate(
					'0.5s ease-out',
					style({ opacity: 1, transform: 'translateY(0)' })
				),
			]),
		]),
		trigger('fadeIn', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('0.6s ease-out', style({ opacity: 1 })),
			]),
		]),
	],
})
export class HeroSection implements OnInit, AfterViewInit, OnDestroy {
	private readonly platformId = inject(PLATFORM_ID);
	private readonly isBrowser = isPlatformBrowser(this.platformId);

	// Signals para controle de estado
	readonly isPlaying = signal(false);
	readonly isVideoLoaded = signal(false);
	readonly showPlayButton = signal(true);

	// Configuração do vídeo
	readonly videoUrl = 'assets/videos/app-demo.mp4';
	readonly posterUrl = 'assets/images/app-preview.jpg';

	// ViewChild para referência ao vídeo
	@ViewChild('videoRef', { static: false })
	videoRef!: ElementRef<HTMLVideoElement>;

	ngOnInit(): void {
		// Componente inicializado
	}

	ngAfterViewInit(): void {
		if (this.isBrowser && this.videoRef) {
			this.setupVideoEventListeners();
		}
	}

	ngOnDestroy(): void {
		if (this.isBrowser && this.videoRef?.nativeElement) {
			this.removeVideoEventListeners();
		}
	}

	private setupVideoEventListeners(): void {
		const video = this.videoRef.nativeElement;

		// Event listeners para controle do vídeo
		video.addEventListener('loadeddata', this.onVideoLoaded);
		video.addEventListener('play', this.onVideoPlay);
		video.addEventListener('pause', this.onVideoPause);
		video.addEventListener('ended', this.onVideoEnded);
		video.addEventListener('error', this.onVideoError);
	}

	private removeVideoEventListeners(): void {
		const video = this.videoRef.nativeElement;

		video.removeEventListener('loadeddata', this.onVideoLoaded);
		video.removeEventListener('play', this.onVideoPlay);
		video.removeEventListener('pause', this.onVideoPause);
		video.removeEventListener('ended', this.onVideoEnded);
		video.removeEventListener('error', this.onVideoError);
	}

	private readonly onVideoLoaded = (): void => {
		this.isVideoLoaded.set(true);
	};

	private readonly onVideoPlay = (): void => {
		this.isPlaying.set(true);
		this.showPlayButton.set(false);
	};

	private readonly onVideoPause = (): void => {
		this.isPlaying.set(false);
		this.showPlayButton.set(true);
	};

	private readonly onVideoEnded = (): void => {
		this.isPlaying.set(false);
		this.showPlayButton.set(true);
		// Reset video position
		if (this.videoRef?.nativeElement) {
			this.videoRef.nativeElement.currentTime = 0;
		}
	};

	private readonly onVideoError = (event: Event): void => {
		console.error('Erro ao carregar vídeo:', event);
		this.isVideoLoaded.set(false);
	};

	togglePlay(): void {
		if (!this.isBrowser || !this.videoRef?.nativeElement) return;

		const video = this.videoRef.nativeElement;

		if (this.isPlaying()) {
			video.pause();
		} else {
			this.playVideo(video);
		}
	}

	private async playVideo(video: HTMLVideoElement): Promise<void> {
		try {
			await video.play();
		} catch (error) {
			console.error('Erro ao reproduzir vídeo:', error);
			this.isPlaying.set(false);
			this.showPlayButton.set(true);
		}
	}

	onTouchStart(): void {
		if (!this.isPlaying()) {
			this.showPlayButton.set(true);
		}
	}

	onKeyboardInteraction(event: KeyboardEvent): void {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			this.togglePlay();
		}
	}

	// Métodos para navegação externa
	openAppStore(): void {
		if (!this.isBrowser) return;
		window.open('#', '_blank', 'noopener,noreferrer');
	}

	openPlayStore(): void {
		if (!this.isBrowser) return;
		window.open('#', '_blank', 'noopener,noreferrer');
	}

	joinCommunity(): void {
		if (!this.isBrowser) return;
		const message = encodeURIComponent(
			'Olá! Gostaria de participar da comunidade Aster Pillbox.'
		);
		const whatsappUrl = `https://wa.me/5547992820932?text=${message}`;
		window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
	}
}
