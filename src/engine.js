export const QUESTIONS = [
 {id:'germany',prompt:'Name a country that shares a land border with Germany.',answers:[['france',10],['poland',15],['austria',20],['switzerland',25],['netherlands',30,'holland'],['denmark',40],['belgium',45],['czechia',65,'czech republic'],['luxembourg',90]]},
 {id:'planet',prompt:'Name one of the eight planets in our solar system.',answers:[['earth',10],['mars',15],['jupiter',25],['saturn',35],['venus',45],['neptune',65],['mercury',75],['uranus',85]]},
 {id:'chess',prompt:'Name a type of chess piece.',answers:[['king',10],['queen',20],['pawn',30],['knight',55,'horse'],['rook',65,'castle'],['bishop',85]]},
 {id:'starter',prompt:'Name a first-partner Pokémon offered at the start of Ruby, Sapphire, or Emerald.',answers:[['treecko',65],['torchic',40],['mudkip',20]]},
 {id:'ocean',prompt:'Name one of Earth’s five oceans.',answers:[['pacific',10,'pacific ocean'],['atlantic',25,'atlantic ocean'],['indian',45,'indian ocean'],['arctic',70,'arctic ocean'],['southern',90,'southern ocean','antarctic','antarctic ocean']]},
 {id:'noble',prompt:'Name a noble gas with atomic number below 100.',answers:[['helium',10],['neon',25],['argon',45],['krypton',65],['xenon',80],['radon',95]]},
 {id:'hyrule',prompt:'Name a piece of the Triforce in The Legend of Zelda.',answers:[['courage',25],['power',45],['wisdom',80]]},
 {id:'primes',prompt:'Name a prime number between 10 and 30. Digits or words work.',answers:[['11',15,'eleven'],['13',25,'thirteen'],['17',45,'seventeen'],['19',60,'nineteen'],['23',80,'twenty three'],['29',95,'twenty nine']]},
 {id:'greatlakes',prompt:'Name one of North America’s five Great Lakes.',answers:[['michigan',15,'lake michigan'],['superior',30,'lake superior'],['erie',50,'lake erie'],['ontario',65,'lake ontario'],['huron',90,'lake huron']]},
 {id:'roman',prompt:'Name a symbol used in standard Roman numerals.',answers:[['i',10],['v',25],['x',30],['l',55],['c',65],['d',85],['m',90]]}
];
export function normalize(value){return String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
export function judge(question,value){const answer=question.answers.find(([name,,...aliases])=>[name,...aliases].some(alias=>normalize(alias)===normalize(value)));return answer?{valid:true,answer:answer[0],points:answer[1],tier:answer[1]>=80?'LEGENDARY':answer[1]>=55?'RARE':answer[1]>=30?'UNCOMMON':'COMMON'}:{valid:false,points:0,tier:'MISS'};}
export function dailyQuestions(date){let seed=2166136261;for(const char of date)seed=Math.imul(seed^char.charCodeAt(0),16777619)>>>0;const pool=[...QUESTIONS];for(let i=pool.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,5);}
export function multiplier(room){return 1+room*.25;}
export function reward(points,room){return Math.round(points*multiplier(room));}
export function localDate(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
