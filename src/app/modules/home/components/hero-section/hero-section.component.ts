import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, NgClass } from '@angular/common';
import {
	AfterViewInit,
	Component,
	ElementRef,
	OnInit,
	signal,
	ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-hero-section',
	standalone: true,
	imports: [CommonModule, RouterModule, NgClass],
	templateUrl: './hero-section.component.html',
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
export class HeroSection implements OnInit, AfterViewInit {
	isPlaying = signal(false);
	isVideoLoaded = signal(false);
	showPlayButton = signal(true);
	videoUrl = 'assets/videos/app-demo.mp4'; // Update with your actual video path

	@ViewChild('videoRef') videoRef!: ElementRef<HTMLVideoElement>;

	ngOnInit(): void {
		// Initialize any data needed
	}

	ngAfterViewInit(): void {
		const video = this.videoRef.nativeElement;

		// Add event listeners
		video.addEventListener('loadeddata', () => {
			this.isVideoLoaded.set(true);
		});

		video.addEventListener('play', () => {
			this.isPlaying.set(true);
			this.showPlayButton.set(false);
		});

		video.addEventListener('pause', () => {
			this.isPlaying.set(false);
			this.showPlayButton.set(true);
		});

		video.addEventListener('ended', () => {
			this.isPlaying.set(false);
			this.showPlayButton.set(true);
			// Optionally reset video position
			video.currentTime = 0;
		});
	}

	togglePlay(): void {
		const video = this.videoRef.nativeElement;
		if (this.isPlaying()) {
			video.pause();
		} else {
			// Add a promise to handle autoplay restrictions
			const playPromise = video.play();

			if (playPromise !== undefined) {
				playPromise
					.then(() => {
						// Video started playing successfully
					})
					.catch((error) => {
						// Auto-play was prevented
						console.error('Play was prevented:', error);
						this.isPlaying.set(false);
					});
			}
		}
	}

	// Helper method to handle touch events and hover on mobile
	onTouchStart(): void {
		if (!this.isPlaying()) {
			this.showPlayButton.set(true);
		}
	}
}
