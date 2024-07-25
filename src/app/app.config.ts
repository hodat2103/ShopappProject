// import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from "@angular/common/http";
// import { ApplicationConfig, importProvidersFrom, Provider } from "@angular/core";
// import { TokenInterceptor } from "./interceptors/token.interceptor";
// import { provideRouter, RouterModule } from "@angular/router";
// import { provideClientHydration } from "@angular/platform-browser";
// import { routes } from './components/admin/admin-routing.module';

// const tokenInterceptorProvider: Provider =
//   { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true };


// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes), 
//     //importProvidersFrom(RouterModule.forRoot(routes)),
//     importProvidersFrom(RouterModule.forChild(routes)),    
//     provideHttpClient(withFetch()),
//     //provideHttpClient(),
//     tokenInterceptorProvider,
//     provideClientHydration(),
//     importProvidersFrom(HttpClientModule),
//   ]
// };