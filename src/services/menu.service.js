import api from './api';

class MenuService {
  getAll() {
    return api.get('/menus');
  }
}

export default new MenuService();
