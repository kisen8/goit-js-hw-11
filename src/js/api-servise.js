import axios from 'axios';

export default class GalleryApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchGallery() {
    axios.defaults.baseURL = 'https://pixabay.com/api/';
    const KEY = '29875471-e0a2deab5b44e6e08843ad533';

    try {
      const response = await axios.get(
        `?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`
      );
      this.incrementPage();
      return response;
    } catch (error) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      console.log(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get query() {
    return this.searchQuery;
  }
}
