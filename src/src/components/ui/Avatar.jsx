import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { iniciais, urlAvatar } from '../../lib/avatar.js';

// Avatar do membro. Usa a semente salva no cadastro quando existir (avatares
// sorteáveis) e cai para o nome quando não houver (grupos, dados antigos).
// Se a imagem não carregar (offline), mostra as iniciais do nome.
const Circulo = styled.div`
  width: ${({ $tamanho }) => $tamanho}px;
  height: ${({ $tamanho }) => $tamanho}px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.cores.primariaSuave};
  color: ${({ theme }) => theme.cores.primaria};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  font-size: ${({ $tamanho }) => Math.round($tamanho * 0.4)}px;
  border: 1px solid ${({ theme }) => theme.cores.borda};

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export function Avatar({ nome, seed, tamanho = 40 }) {
  const [falhou, setFalhou] = useState(false);
  const semente = seed || nome;

  // Semente nova (ex.: sorteio no formulário), nova tentativa de carregar.
  useEffect(() => {
    setFalhou(false);
  }, [semente]);

  return (
    <Circulo $tamanho={tamanho} title={nome} aria-label={nome || 'Membro'}>
      {falhou ? (
        iniciais(nome)
      ) : (
        <img
          src={urlAvatar(semente, { tamanho: tamanho * 2 })}
          alt=""
          loading="lazy"
          onError={() => setFalhou(true)}
        />
      )}
    </Circulo>
  );
}
