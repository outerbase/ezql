import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('ezql-prompt')
export class EzqlPrompt extends LitElement {
  static override styles = css``;

  @property()
  query?: string = '';

  override render() {}
}

@customElement('outerbase-modal')
export class OuterbaseModal extends LitElement {
  static override styles = css`
    .root {
      position: relative;
      z-index: 100;
      opacity: 1;
      animation-name: fadeInOpacity;
      animation-iteration-count: 1;
      animation-timing-function: ease-in;
      animation-duration: 0.1s;
    }

    .search-icon {
      margin: 0 0.75rem;
    }

    .backdrop_shadow {
      position: fixed;
      inset: 0;
      background-color: var(--blurry-background);
      backdrop-filter: blur(4px);
      animation-name: fadeInBlur;
      animation-iteration-count: 1;
      animation-timing-function: ease-in;
      animation-duration: 0.2s;
    }

    .container {
      position: fixed;
      inset: 0;
      z-index: 10;
      overflow-y: auto;
    }

    .backdrop {
      display: flex;
      min-height: 100%;
      justify-items: end;
      justify-content: center;
      align-items: center;
    }

    .foreground {
      border-radius: 0.375rem /* 6px */;
      background-color: var(--color-gray-200);
      border: 1px solid var(--color-gray-300);
      text-align: left;
      width: 100%;
      max-width: 48rem /* 896px */;
      box-shadow: 0 0 16px var(--color-gray-300);
    }

    @keyframes fadeInOpacity {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    @keyframes fadeInBlur {
      0% {
        backdrop-filter: blur(0px);
      }
      100% {
        backdrop-filter: blur(4px);
      }
    }

    /* this min-height ensures that the modal doesn't get clipped above the viewport
  when being shifted with a negative margin.
  i.e. the modal remains centered when the window isn't sufficiently tall */
    @media (min-height: 34rem) {
      .foreground {
        margin-top: -25%;
      }
    }
  `;

  override render() {
    return html` <div
      className="root"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick="{dismissWhenBgClicked}"
    >
      <div className="backdrop"></div>
      <div className="container">
        <div className="backdrop" ref="{bgDivRef}">
          <div className="foreground">
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>`;
  }
}

// Providing good TypeScript typings
// https://lit.dev/docs/components/defining/#typescript-typings
declare global {
  interface HTMLElementTagNameMap {
    'outerbase-modal': OuterbaseModal;
    'ezql-prompt': EzqlPrompt;
  }
}
