// Ponto único de personalização do projeto.
// Trocou o nome, o campus ou os textos aqui? A interface inteira acompanha.
export const brand = {
  name: 'UniResolve',
  tagline: 'Relate problemas. Acompanhe soluções.',
  institution: 'Centro Universitário Jorge Amado',
  institutionShort: 'Unijorge',
  campus: 'Campus Paralela',
  city: 'Salvador, BA',
  address: 'Av. Luís Viana Filho, 6775, Trobogy, Salvador, BA',
  teamLabel: 'Equipe do campus',
  footerNote: 'Projeto Design Thinking · Campus Paralela · 2026',
}

export const accents = [
  { id: 'blue', label: 'Azul', swatch: '#1A56DB' },
  { id: 'emerald', label: 'Esmeralda', swatch: '#059669' },
  { id: 'violet', label: 'Violeta', swatch: '#7c3aed' },
  { id: 'rose', label: 'Rosa', swatch: '#e11d48' },
  { id: 'amber', label: 'Âmbar', swatch: '#d97706' },
  { id: 'cyan', label: 'Ciano', swatch: '#0891b2' },
]

export const roles = {
  student: {
    id: 'student',
    label: 'Aluno',
    description: 'Registra ocorrências e acompanha as suas',
    canManage: false,
  },
  staff: {
    id: 'staff',
    label: 'Equipe',
    description: 'Atende a fila e atualiza o andamento',
    canManage: true,
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    description: 'Visão geral e gestão de todas as ocorrências',
    canManage: true,
  },
}

export const staffUsers = {
  staff: { name: 'Equipe de Facilities', setor: 'Gestão de Facilities', email: 'facilities@unijorge.edu.br' },
  admin: { name: 'Direção Acadêmica', setor: 'Direção do Campus', email: 'direcao@unijorge.edu.br' },
}
