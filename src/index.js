import GalleryApiService from './js/api-servise';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import LoadMoreBtn from './js/load-more-button';

const refs = {
  galleryWrap: document.querySelector('.gallery'),
  form: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  endText: document.querySelector('.end__text'),
};

const loadMoreBtn = new LoadMoreBtn({
  cls: '.load-more',
  hidden: true,
});
const galleryApiService = new GalleryApiService();
let lightbox = {};

refs.form.addEventListener('submit', onSearch);
if (loadMoreBtn.refs.btn) {
  loadMoreBtn.refs.btn.addEventListener('click', onLoadMore);
}

async function onSearch(e) {
  e.preventDefault();

  clearGalleryMarkup();
  galleryApiService.searchQuery =
    e.currentTarget.elements.searchQuery.value.trim();

  if (!galleryApiService.searchQuery) {
    clearGalleryMarkup();
    Notify.warning('Please write something');
    loadMoreBtn.hide();
    refs.endText.classList.add('is-hidden');
    refs.form.reset();

    return;
  }

  loadMoreBtn.hide();

  if (refs.endText) refs.endText.classList.add('is-hidden');

  galleryApiService.resetPage();

  const filesFromBackEnd = await galleryApiService.fetchGallery();

  createGalleryMarkup(filesFromBackEnd.data.hits);
  loadMoreBtn.enable();
  onSubmitControl(filesFromBackEnd);

  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  refs.form.reset();
}

function onSubmitControl(filesFromBackEnd) {
  if (filesFromBackEnd.data.total > 500) {
    Notify.success(
      `Hooray! We found ${filesFromBackEnd.data.total} images, but we can only show the first ${filesFromBackEnd.data.totalHits}!`
    );
    loadMoreBtn.show();
  } else if (
    filesFromBackEnd.data.total > 40 &&
    filesFromBackEnd.data.total <= 500
  ) {
    Notify.success(`Hooray! We found ${filesFromBackEnd.data.total} images!`);
    loadMoreBtn.show();

    refs.endText.classList.add('is-hidden');
  } else if (
    filesFromBackEnd.data.totalHits > 0 &&
    filesFromBackEnd.data.totalHits <= 40
  ) {
    Notify.success(`Hooray! We found ${filesFromBackEnd.data.total} images!`);
    loadMoreBtn.hide();
    refs.endText.classList.remove('is-hidden');
  } else if (filesFromBackEnd.data.total === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreBtn.hide();
  }
}

function createGalleryMarkup(cards) {
  refs.galleryWrap.insertAdjacentHTML(
    'beforeend',
    cards
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => `<div class="photo-card">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" height ="300" width = "400" />
        <div class="info">
          <p class="info-item">
            <b>Likes: ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${downloads}</b>
          </p>
        </div>
        </a>
      </div>`
      )
      .join('')
  );
}

function clearGalleryMarkup() {
  refs.galleryWrap.innerHTML = '';
}

async function onLoadMore() {
  const filesFromBackEnd = await galleryApiService.fetchGallery();
  createGalleryMarkup(filesFromBackEnd.data.hits);

  if (
    filesFromBackEnd.data.hits.length >= 0 &&
    filesFromBackEnd.data.hits.length < 40
  ) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.hide();
    refs.endText.classList.remove('is-hidden');
  } else if (galleryApiService.page === 13) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.hide();
    refs.endText.classList.remove('is-hidden');
  }
  lightbox.refresh();
}
