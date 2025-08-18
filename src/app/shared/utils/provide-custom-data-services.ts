import { EnvironmentProviders, Type, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { EntityCollectionDataService, EntityDataService } from '@ngrx/data';

export interface CustomDataServiceConfig<T = unknown> {
    entityName: string;
    dataService: Type<EntityCollectionDataService<T>>;
}

// Provides the classes + registers them at app init
export function provideCustomDataServices(services: ReadonlyArray<CustomDataServiceConfig<any>>): EnvironmentProviders {
    return makeEnvironmentProviders([
        // 1) Make every data service injectable
        ...services.map(s => s.dataService),

        // 2) Register them once DI is ready
        provideAppInitializer(() => {
            const entityDataService = inject(EntityDataService);
            services.forEach(({ entityName, dataService }) => {
                const instance = inject(dataService) as EntityCollectionDataService<any>;
                entityDataService.registerService(entityName, instance);
            });
        }),
    ]);
}