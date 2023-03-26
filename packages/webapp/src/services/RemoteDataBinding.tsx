// @ts-nocheck
import ApiService from '@/services/ApiService';

export default class RemoteDataBinding {

  execute(state) {
    return this.getData(state);
  }

  getData(state) {
    const pageQuery = `$skip=${state.skip}&$top=${state.take}`;
    let sortQuery = '';

    if ((state.sorted || []).length) {
      sortQuery = `&$orderby=` + (state).sorted.map((obj) => {
        return obj.direction === 'descending' ? `${obj.name} desc` : obj.name;
      }).reverse().join(',');
    }

    this.ajax.url = `${this.baseUrl}?${pageQuery}${sortQuery}&$inlinecount=allpages&$format=json`;

    return ApiService.get(this.ajax.url).then((response) => {
      let data = JSON.parse(response);
      return {
        result: data['d']['results'],
        count: parseInt(data['d']['__count'], 10),
      };
    });
  }
}