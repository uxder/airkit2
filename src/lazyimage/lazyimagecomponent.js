import ImageLoader from './imageloader';
import InviewComponent from '../inview/inviewcomponent';


/**
 * Component that renders one or more images when it comes inview.
 */
export class LazyImageComponent extends InviewComponent {
  /** @override */
  constructor(element, options) {
    super(element, options);

    /** @type {ImageLoader} */
    this.imageLoader = new ImageLoader();

    /** @type {boolean} */
    this.loading = false;

    /** @type {boolean} */
    this.loaded = false;
  }

  /** @override */
  destroy() {
    super.destroy();
    this.imageLoader = null;
  }

  /** @override */
  handleInview_(isInview) {
    super.handleInview_(isInview);

    if (isInview && !this.loading && !this.loaded) {
      this.loadImages_();
    }
  }

  /**
   * Loads all images with lazyimage-src or lazyimage-background-image attrs.
   * @private
   */
  loadImages_() {
    this.loading = true;

    const imgEls = [].slice.call(
        this.element.querySelectorAll('[lazyimage-src]'));
    if (this.element.hasAttribute('lazyimage-src')) {
      imgEls.push(this.element);
    }
    imgEls.forEach((el) => {
      const src = el.getAttribute('lazyimage-src');
      this.imageLoader.load(src).then((loadedSrc) => {
        el.src = loadedSrc;
        el.setAttribute('lazyimage-loaded', 'true');
      });
    });

    const bgEls = [].slice.call(
        this.element.querySelectorAll('[lazyimage-background-image]'));
    if (this.element.hasAttribute('lazyimage-background-image')) {
      bgEls.push(this.element);
    }
    bgEls.forEach((el) => {
      const src = el.getAttribute('lazyimage-background-image');
      this.imageLoader.load(src).then((loadedSrc) => {
        el.style.backgroundImage = `url(${loadedSrc})`;
        el.setAttribute('lazyimage-loaded', 'true');
      });
    });

    this.imageLoader.wait().then(() => {
      this.loading = false;
      this.loaded = true;
      if (this.options.loadedClass) {
        this.element.classList.add(this.options.loadedClass);
      }
    });
  }
}


export default LazyImageComponent;