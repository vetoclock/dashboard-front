import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    /** Example purpose only, please remove */
    {
        key: 'singleMenuItem',
        path: '/especialistas',
        component: lazy(() => import('@/views/demo/Especialistas')),
        authority: [],
    },
    {
        key: 'singleMenuItem',
        path: '/casos-por-especialista',
        component: lazy(
            () =>
                import(
                    '@/views/demo/CasosPorEspecialista/CasosPorEspecialista'
                ),
        ),
        authority: [],
    },
    {
        key: 'collapseMenu.item1',
        path: '/ingresos-historico-anual',
        component: lazy(() => import('@/views/demo/VentasHistoricoAnual')),
        authority: [],
    },

    {
        key: 'collapseMenu.item3',
        path: '/ingresos-por-cliente',
        component: lazy(() => import('@/views/demo/VentasPorCliente')),
        authority: [],
    },
    {
        key: 'collapseMenu.item3',
        path: '/casos-historico-anual',
        component: lazy(() => import('@/views/demo/CasosHistoricoAnual')),
        authority: [],
    },
    {
        key: 'collapseMenu.item4',
        path: '/tipos-de-caso',
        component: lazy(() => import('@/views/demo/TiposDeCaso')),
        authority: [],
    },
    {
        key: 'collapseMenu.item4',
        path: '/casos-por-cliente',
        component: lazy(() => import('@/views/demo/CasoPorGrupo')),
        authority: [],
    },

    {
        key: 'collapseMenu.item8',
        path: '/costes',
        component: lazy(() => import('@/views/demo/Costes')),
        authority: [],
    },
    {
        key: 'collapseMenu.item8',
        path: '/margen',
        component: lazy(() => import('@/views/demo/Margen')),
        authority: [],
    },
    {
        key: 'collapseMenu.item8',
        path: '/tiempo-de-respuesta',
        component: lazy(() => import('@/views/demo/TiempoDeRespuesta')),
        authority: [],
    },

    ...othersRoute,
]
