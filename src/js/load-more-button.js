export default class LoadMoreBtn {
  constructor({ cls, hidden = false }) {
    this.refs = this.getRefs(cls);

    hidden && this.hide();
  }

  getRefs(cls) {
    const refs = {};
    // console.log('cls', cls);
    // console.log('cls_TEST', document.querySelector(cls));
    refs.btn = document.querySelector(cls);
    // console.log('refs44', refs);
    refs.label = refs.btn.querySelector('.label');
    return refs;
  }

  enable() {
    this.refs.btn.disabled = false;
    this.refs.label.textContent = 'Load more';
  }

  disabled() {
    this.refs.btn.disabled = true;
    this.refs.label.textContent = 'Loading...';
  }

  show() {
    this.refs.btn.classList.remove('is-hidden');
  }

  hide() {
    this.refs.btn.classList.add('is-hidden');
  }
}
