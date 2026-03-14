declare module 'jsrsasign' {
  export const KJUR: {
    jws: {
      JWS: {
        sign(alg: string, header: string, payload: string, key: string): string
        verify(jws: string, key: string): boolean
      }
    }
  }

  export const KEYUTIL: {
    getKey(pem: string): unknown
  }

  export function parseBigInt(str: string, radix: number): unknown
}
