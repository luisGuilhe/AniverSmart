import { importContacts } from '../services/database';
import { Contact } from '../services/database';

// Birthdays spread across the year; several near April 21 to test "today" and "soon" badges
const MOCK_CONTACTS: Omit<Contact, 'id' | 'createdAt'>[] = [
  // --- hoje e próximos 7 dias (testa badges HOJE / DIAS) ---
  { name: 'Ana Paula Ferreira',      birthDate: '1990-04-21', relationship: 'melhor_amigo_a', phone: '11991110001', fromGoogle: 0 },
  { name: 'Carlos Eduardo Lima',     birthDate: '1985-04-21', relationship: 'amigo_a',        phone: '11991110002', fromGoogle: 0 },
  { name: 'Mariana Costa Silva',     birthDate: '1993-04-22', relationship: 'primo_a',         phone: '11991110003', fromGoogle: 0 },
  { name: 'Pedro Henrique Souza',    birthDate: '1988-04-23', relationship: 'irmao_a',         phone: '11991110004', fromGoogle: 0 },
  { name: 'Juliana Alves Rocha',     birthDate: '1995-04-24', relationship: 'cunhado_a',       phone: '11991110005', fromGoogle: 0 },
  { name: 'Rafael Oliveira Nunes',   birthDate: '1982-04-25', relationship: 'colega',          phone: '11991110006', fromGoogle: 1 },
  { name: 'Fernanda Moraes Dias',    birthDate: '1997-04-26', relationship: 'amigo_a',         phone: '11991110007', fromGoogle: 0 },
  { name: 'Lucas Pereira Teixeira',  birthDate: '1991-04-27', relationship: 'primo_a',         phone: '11991110008', fromGoogle: 0 },

  // --- família ---
  { name: 'José Carlos Ribeiro',     birthDate: '1958-03-15', relationship: 'pai',             phone: '11991110009', fromGoogle: 0 },
  { name: 'Maria Aparecida Ribeiro', birthDate: '1960-07-08', relationship: 'mae',             phone: '11991110010', fromGoogle: 0 },
  { name: 'Antônio Ribeiro Filho',   birthDate: '1987-09-22', relationship: 'irmao_a',         phone: '11991110011', fromGoogle: 0 },
  { name: 'Cláudia Ribeiro Santos',  birthDate: '1989-11-05', relationship: 'irmao_a',         phone: '11991110012', fromGoogle: 0 },
  { name: 'Luiz Henrique Barbosa',   birthDate: '1935-02-14', relationship: 'avo_a',           phone: '11991110013', fromGoogle: 0 },
  { name: 'Conceição de Souza',      birthDate: '1938-06-30', relationship: 'avo_a',           phone: '11991110014', fromGoogle: 0 },
  { name: 'Mateus Ribeiro Costa',    birthDate: '2015-08-19', relationship: 'filho_a',         phone: '11991110015', fromGoogle: 0 },
  { name: 'Sofia Ribeiro Costa',     birthDate: '2018-12-03', relationship: 'filho_a',         phone: '11991110016', fromGoogle: 0 },
  { name: 'Roberto Martins Lima',    birthDate: '1955-10-17', relationship: 'tio_a',           phone: '11991110017', fromGoogle: 0 },
  { name: 'Vera Lúcia Martins',      birthDate: '1957-04-02', relationship: 'tio_a',           phone: '11991110018', fromGoogle: 0 },
  { name: 'Gabriel Martins Rocha',   birthDate: '1998-01-28', relationship: 'sobrinho_a',      phone: '11991110019', fromGoogle: 0 },
  { name: 'Beatriz Martins Rocha',   birthDate: '2001-05-14', relationship: 'sobrinho_a',      phone: '11991110020', fromGoogle: 0 },

  // --- cônjuge / parceiro ---
  { name: 'Patricia Oliveira Ramos', birthDate: '1990-09-11', relationship: 'esposo_a',        phone: '11991110021', fromGoogle: 0 },

  // --- sogros / cunhados ---
  { name: 'Francisco Ramos Neto',    birthDate: '1962-03-28', relationship: 'sogro_a',         phone: '11991110022', fromGoogle: 0 },
  { name: 'Teresa Ramos Alves',      birthDate: '1965-08-07', relationship: 'sogro_a',         phone: '11991110023', fromGoogle: 0 },
  { name: 'Diego Ramos Figueiredo',  birthDate: '1992-06-20', relationship: 'cunhado_a',       phone: '11991110024', fromGoogle: 0 },

  // --- amigos ---
  { name: 'Bruno Carvalho Mendes',   birthDate: '1986-02-09', relationship: 'melhor_amigo_a',  phone: '11991110025', fromGoogle: 0 },
  { name: 'Camila Souza Pinto',      birthDate: '1994-12-25', relationship: 'melhor_amigo_a',  phone: '11991110026', fromGoogle: 0 },
  { name: 'Daniel Ferreira Gomes',   birthDate: '1989-07-04', relationship: 'amigo_a',         phone: '11991110027', fromGoogle: 1 },
  { name: 'Elaine Cristina Borges',  birthDate: '1992-10-31', relationship: 'amigo_a',         phone: '11991110028', fromGoogle: 0 },
  { name: 'Felipe Augusto Vieira',   birthDate: '1984-05-20', relationship: 'amigo_a',         phone: '11991110029', fromGoogle: 1 },
  { name: 'Gabriela Neves Cardoso',  birthDate: '1996-01-15', relationship: 'amigo_a',         phone: '11991110030', fromGoogle: 0 },
  { name: 'Henrique Prado Melo',     birthDate: '1987-03-03', relationship: 'amigo_a',         phone: '11991110031', fromGoogle: 0 },
  { name: 'Isabela Cunha Torres',    birthDate: '1999-09-09', relationship: 'amigo_a',         phone: '11991110032', fromGoogle: 0 },

  // --- trabalho ---
  { name: 'João Paulo Machado',      birthDate: '1978-11-22', relationship: 'chefe',           phone: '11991110033', fromGoogle: 1 },
  { name: 'Karine Lemos Freitas',    birthDate: '1983-04-16', relationship: 'colega',          phone: '11991110034', fromGoogle: 1 },
  { name: 'Leonardo Braga Castro',   birthDate: '1990-06-01', relationship: 'colega',          phone: '11991110035', fromGoogle: 1 },
  { name: 'Melissa Farias Duarte',   birthDate: '1985-08-28', relationship: 'colega',          phone: '11991110036', fromGoogle: 1 },
  { name: 'Nelson Queiroz Andrade',  birthDate: '1975-02-17', relationship: 'socio',           phone: '11991110037', fromGoogle: 0 },
  { name: 'Olívia Tavares Peixoto',  birthDate: '1993-07-23', relationship: 'funcionario',     phone: '11991110038', fromGoogle: 0 },
  { name: 'Paulo Sérgio Monteiro',   birthDate: '1980-12-10', relationship: 'cliente',         phone: '11991110039', fromGoogle: 0 },
  { name: 'Quésia Albuquerque Sá',   birthDate: '1988-10-05', relationship: 'colega',          phone: '11991110040', fromGoogle: 1 },

  // --- vizinhos / conhecidos ---
  { name: 'Rogério Fonseca Lima',    birthDate: '1972-01-08', relationship: 'vizinho_a',       phone: '11991110041', fromGoogle: 0 },
  { name: 'Sandra Mara Cavalcanti',  birthDate: '1969-05-30', relationship: 'vizinho_a',       phone: '11991110042', fromGoogle: 0 },
  { name: 'Tiago Nascimento Vaz',    birthDate: '1995-09-18', relationship: 'conhecido_a',     phone: '11991110043', fromGoogle: 0 },
  { name: 'Ursula Campos Brito',     birthDate: '1991-11-27', relationship: 'conhecido_a',     phone: '11991110044', fromGoogle: 0 },

  // --- primos / parentes distantes ---
  { name: 'Vinicius Araújo Leite',   birthDate: '1994-03-07', relationship: 'primo_a',         phone: '11991110045', fromGoogle: 0 },
  { name: 'Wanderley Cruz Sampaio',  birthDate: '1983-08-14', relationship: 'primo_a',         phone: '11991110046', fromGoogle: 0 },
  { name: 'Xênia Rodrigues Bastos',  birthDate: '1997-06-11', relationship: 'primo_a',         phone: '11991110047', fromGoogle: 0 },

  // --- padrasto / namorado / outros ---
  { name: 'Yago Teles Magalhães',    birthDate: '1979-02-03', relationship: 'padrasto_a',      phone: '11991110048', fromGoogle: 0 },
  { name: 'Zilda Menezes Correia',   birthDate: '2000-10-20', relationship: 'namorado_a',      phone: '11991110049', fromGoogle: 0 },
  { name: 'Alexandre Pires Corrêa',  birthDate: '1976-07-16', relationship: 'outros',          phone: '11991110050', fromGoogle: 0 },
];

export async function seedMockContacts(): Promise<number> {
  await importContacts(MOCK_CONTACTS);
  return MOCK_CONTACTS.length;
}
