import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  /**
  * not used
  */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  /**
  * not used
  */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    // Optional: Implement storing logic if needed
  }

  /**
  * not used
  */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  /**
  * not used
  */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }

  /**
  * Custom route reuse logic 
  * @returns true to reuse the route or false to not reuse it
  * in this case always true to get the gates alsways initialized while loaded by routes
  * implemented in app.module.ts -providers
  */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // return future.routeConfig === curr.routeConfig; // if we need to sue it somtimes
    return false;
  }
}
