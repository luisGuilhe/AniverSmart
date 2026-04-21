import { RelationshipType } from '../utils/constants';

const messages: Record<string, string[]> = {
  avo: [
    'Querido vovô, que este dia especial seja repleto de amor, saúde e alegria! Você é um tesouro na minha vida. Feliz aniversário!',
    'Vovô querido, hoje é o seu dia! Que Deus te abençoe com muita saúde e paz. Te amo muito!',
    'Parabéns, vovô! Cada momento ao seu lado é uma bênção. Que você tenha um dia maravilhoso rodeado de carinho!',
  ],
  avoa: [
    'Querida vovó, que este dia seja repleto de amor e alegria! Você é meu exemplo de força e carinho. Feliz aniversário!',
    'Vovó linda, hoje é o seu dia! Que Deus te abençoe com muita saúde e felicidade. Te amo demais!',
    'Parabéns, vovó! Você é um anjo na minha vida. Que sua vida seja sempre cheia de amor e gratidão!',
  ],
  mae: [
    'Mãe querida, você merece um dia tão especial quanto o amor que nos dá todos os dias. Feliz aniversário! Te amo muito!',
    'Para a melhor mãe do mundo: parabéns! Sua dedicação e carinho são meu maior presente. Que hoje seja lindo para você!',
    'Mãe, hoje é o seu dia! Obrigado por tudo que você faz por mim. Que Deus te abençoe com muita saúde e felicidade!',
  ],
  pai: [
    'Pai querido, parabéns pelo seu aniversário! Você é meu herói e meu exemplo. Que hoje seja um dia incrível para você!',
    'Para o melhor pai do mundo: feliz aniversário! Obrigado por tudo, pai. Te amo muito!',
    'Pai, hoje é o seu dia! Que você tenha muito saúde, paz e alegria. Você merece tudo de bom nessa vida!',
  ],
  amigo: [
    'E aí? Parabéns por mais um ano de vida! Que esse ano seja cheio de conquistas e alegrias. Saúde, parceiro!',
    'Feliz aniversário, meu amigo! Que esse dia seja o começo do melhor ano da sua vida. Bora comemorar!',
    'Parabéns! Mais um ano vivendo e aprendendo. Que venham muitos mais cheios de aventuras e risadas!',
  ],
  amiga: [
    'Feliz aniversário, minha amiga! Que esse dia seja tão especial quanto você é para mim. Saúde e alegria sempre!',
    'Parabéns! Que esse novo ano da sua vida seja incrível, cheio de coisas boas e muita felicidade!',
    'E aí? Parabéns! Você merece tudo de melhor. Que 2024 seja seu ano!',
  ],
  namorado: [
    'Feliz aniversário, meu amor! Você é meu presente favorito. Que esse dia seja tão especial quanto tudo que você representa para mim.',
    'Parabéns, amor! Obrigada por fazer cada dia mais especial. Te amo muito e desejo tudo de bom para você!',
    'Hoje é o seu dia, amor! Que venham muitos anos juntos cheios de amor, cumplicidade e felicidade. Te amo!',
  ],
  namorada: [
    'Feliz aniversário, meu amor! Você é meu presente favorito. Que esse dia seja tão especial quanto você é para mim.',
    'Parabéns, amor! Cada dia ao seu lado é uma bênção. Te amo muito e desejo tudo de bom para você!',
    'Hoje é o seu dia, meu amor! Que venham muitos anos juntos repletos de amor e felicidade. Te amo!',
  ],
  colega: [
    'Feliz aniversário! Desejo um dia repleto de sucesso, alegria e muito merecido descanso. Parabéns!',
    'Parabéns pelo seu aniversário! Que esse novo ano traga muitas realizações profissionais e pessoais!',
    'Feliz aniversário! Que esse dia seja tão produtivo quanto você é no trabalho. Muitas conquistas pela frente!',
  ],
  conhecido: [
    'Feliz aniversário! Desejo um excelente dia e um ano cheio de realizações e saúde!',
    'Parabéns pelo seu aniversário! Que esse novo ciclo seja muito especial para você.',
    'Muitos parabéns! Que você tenha um dia maravilhoso e um ano repleto de bênçãos!',
  ],
  conhecida: [
    'Feliz aniversário! Desejo um excelente dia e um ano cheio de realizações e saúde!',
    'Parabéns pelo seu aniversário! Que esse novo ciclo seja muito especial para você.',
    'Muitos parabéns! Que você tenha um dia maravilhoso e um ano repleto de bênçãos!',
  ],
};

export function generateMessage(name: string, relationship: string, lastMessages: string[] = []): string {
  const templates = messages[relationship] ?? messages['conhecido'];

  const unused = templates.filter(m => !lastMessages.includes(m));
  const pool = unused.length > 0 ? unused : templates;

  const template = pool[Math.floor(Math.random() * pool.length)];
  return template.replace(/\b(Você|você)\b/g, m => m); // keep as-is, personalize if needed
}
