import { ActivatedRoute, Router, RouterState } from '@angular/router';
import { StorageService } from './storage.service';


export interface FilterConfig {
  [propName: string]: FilterItemConfig;
}

export interface FilterItemConfig {
  type: 'array' | 'string' | 'boolean';
  options?: Array<any>;
  defaultOption?: any;
}

export class FilterService {
  private static setDefaultOrRemove(filter, config: FilterConfig, output): void {
    if (config[filter].defaultOption) {
      output[filter] = config[filter].defaultOption;
    } else {
      delete output[filter];
    }
  }

  private static getValue(param, conf: FilterItemConfig): any {
    let res;
    if (param != null) {
      switch (conf.type) {
        case 'boolean':
          if (typeof param === 'boolean' || param === 'true' || param === 'false') {
            res = JSON.parse(param);
          }
          break;
        case 'string':
          if (!conf.options || conf.options.some(_ => _ === param)) {
            res = param.toString();
          }
          break;
        case 'array':
          let par = param;
          if (typeof param === 'string') {
            par = param.split(',');
          } else if (!Array.isArray(param)) {
            break;
          }
          if (!conf.options) {
            res = par;
          } else {
            res = par.filter(p => conf.options.some(_ => _ === p));
          }
          break;
      }
    }
    return res;
  }

  constructor(private config: FilterConfig,
              private router: Router,
              private storage: StorageService,
              private key: string,
              private activatedRoute: ActivatedRoute) {
  }

  public update(params): void {
    if (this.getRouteWithoutQueryParams(this.router.routerState) === '/') {
      return;
    }

    const queryParams = Object.keys(params).reduce((memo, field) => {
      if (params.hasOwnProperty(field)) {
        const val = params[field];
        if (!Array.isArray(val) || val.length) {
          memo[field] = val;
        }
        return memo;
      }
    }, {});

    this.router.navigate([], { queryParams })
      .then(() => this.storage.update(this.key, queryParams));
  }

  public getParams(): any {
    const queryParams = this.activatedRoute.snapshot.queryParams;

    let storage = {};
    try {
      storage = JSON.parse(this.storage.get(this.key)) || {};
    } catch (e) {
      this.storage.remove(this.key);
    }

    return Object.keys(this.config).reduce((memo, filter) => {
      const param = queryParams[filter];
      if (this.config.hasOwnProperty(filter)) {
        memo[filter] = FilterService.getValue(param, this.config[filter]);
      }

      if (memo[filter] == null && storage.hasOwnProperty(filter)) {
        memo[filter] = FilterService.getValue(
          storage[filter],
          this.config[filter]
        );
      }

      if (memo[filter] == null) {
        FilterService.setDefaultOrRemove(filter, this.config, memo);
      }

      return memo;
    }, {});
  }

  private getRouteWithoutQueryParams(routerState: RouterState): string {
    if (routerState) {
      return routerState.snapshot.url.split('?')[0];
    }
    return '/';
  }
}
