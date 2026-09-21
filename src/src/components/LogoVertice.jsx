// Marca do Vértice: triângulo (vértice) apontando para baixo com três círculos
// nas pontas. Desenhado em SVG e usa currentColor, então a cor vem do CSS pai.
export function LogoVertice({ size = 32, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M16 21 L48 21 L32 47 Z" />
      <circle cx="11" cy="13" r="3.4" />
      <circle cx="53" cy="13" r="3.4" />
      <circle cx="32" cy="55" r="3.4" />
    </svg>
  );
}
