import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `<div class="loader"><div class="tile"></div></div>`,
  styles: [`
    .loader {
      --speed: 1000ms;
      position: relative;
      font-size: 2.5em;
    }

    .loader .tile {
      width: 1em;
      height: 1em;
      animation: var(--speed) ease infinite jump;
      transform-origin: 0 100%;
      will-change: transform;
    }

    .loader .tile::before {
      content: "";
      display: block;
      width: inherit;
      height: inherit;
      border-radius: 0.15em;
      background-image: linear-gradient(325deg, #00573c, #95c37c);
      animation: var(--speed) ease-out infinite spin;
      will-change: transform;
    }

    .loader::after {
      content: "";
      display: block;
      width: 1.1em;
      height: 0.2em;
      background-color: #0132;
      border-radius: 60%;
      position: absolute;
      left: -0.05em;
      bottom: -0.1em;
      z-index: -1;
      animation: var(--speed) ease-in-out infinite shadow;
      filter: blur(0.02em);
      will-change: transform filter;
    }

    @keyframes jump {
      0% {
        transform: scaleY(1) translateY(0);
      }
      16% {
        transform: scaleY(0.6) translateY(0);
      }
      22% {
        transform: scaleY(1.2) translateY(-5%);
      }
      24%,
      62% {
        transform: scaleY(1) translateY(-33%);
      }
      66% {
        transform: scaleY(1.2) translateY(0);
      }
      72% {
        transform: scaleY(0.8) translateY(0);
      }
      88% {
        transform: scaleY(1) translateY(0);
      }
    }

    @keyframes spin {
      0%,
      18% {
        transform: rotateZ(0);
        border-radius: 0.15em;
      }
      38% {
        border-radius: 0.25em;
      }
      66%,
      100% {
        transform: rotateZ(1turn);
        border-radius: 0.15em;
      }
    }

    @keyframes shadow {
      0% {
        transform: scale(1);
        filter: blur(0.02em);
      }
      25%,
      60% {
        transform: scale(0.8);
        filter: blur(0.06em);
      }
      70% {
        transform: scale(1.1);
        filter: blur(0.02em);
      }
      90% {
        transform: scale(1);
      }
    }
  `]
})

export class LoaderComponent { }