import { api } from "../http/client";

/**
 * Vitrina pública de negocios con ofertas.
 *
 * Es el MISMO endpoint que usa la vitrina del linktree (`/circulars/storefront`).
 * Se comparte a propósito: si el sorteo listara los negocios por su cuenta,
 * tarde o temprano una lista mostraría comercios que la otra no.
 *
 * A diferencia de `getStoresBySweepstake`, esta lista NO depende de que el
 * negocio esté asignado al sorteo: muestra a todos los que tienen ofertas
 * publicadas, que es lo que la persona reconoce cuando elige dónde compra.
 */

export interface StorefrontStore {
  id: string;
  name: string;
  slug: string;
  address: string;
  zipCode: string;
  image: string;
  /** Ofertas visibles esta semana. */
  offers: number;
  /** Sólo llega si el navegador dio permiso de ubicación. */
  distanceMiles: number | null;
}

export interface StorefrontResponse {
  ok: boolean;
  /** true = ordenado por cercanía; false = por cantidad de ofertas. */
  nearby: boolean;
  stores: StorefrontStore[];
}

export async function getStorefront(params?: {
  lat?: number;
  lng?: number;
  limit?: number;
}): Promise<StorefrontResponse> {
  const { data } = await api.get<StorefrontResponse>("/circulars/storefront", {
    params,
  });
  return data;
}
