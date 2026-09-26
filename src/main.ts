const URL_API = 'http://localhost:3333';

/*📌 Milestone 1
Crea un type alias Person per rappresentare una persona generica.

Il tipo deve includere le seguenti proprietà:

id: numero identificativo, non modificabile
name: nome completo, stringa non modificabile
birth_year: anno di nascita, numero
death_year: anno di morte, numero opzionale
biography: breve biografia, stringa
image: URL dell'immagine, stringa */

type Person = {
  readonly id: number,
  readonly name: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string
};

/* 📌 Milestone 2
Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:

most_famous_movies: una tuple di 3 stringhe
awards: una stringa
nationality: una stringa tra un insieme definito di valori.
Le nazionalità accettate sono: American, British, Australian, Israeli-American, South African, French, Indian, Israeli, Spanish, South Korean, Chinese.
 */

type ActressNationality =
  | "American"
  | "British"
  | "Australian"
  | "Israeli-American"
  | "South African"
  | "French"
  | "Indian"
  | "Israeli"
  | "Spanish"
  | "South Korean"
  | "Chinese"

type Actress = Person & {
  most_famous_movies: [string, string, string],
  awards: string,
  nationality: ActressNationality
};

/*📌 Milestone 3
Crea una funzione getActress che, dato un id, effettua una chiamata a:

GET /actresses/:id
La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.

Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta.

 */

function isActress(data: unknown): data is Actress {
  if (data && typeof data === 'object' && data !== null && // controllo il dato che ricevo se è il dato di cui ho bisogno 
    'id' in data && typeof data.id === "number" && //controllo id
    'name' in data && typeof data.name === 'string' && //controllo nome
    'birth_year' in data && typeof data.birth_year === 'number' && //controllo compleanno
    'death_year' in data && typeof data.death_year === 'number' && //controllo anno morte
    'biography' in data && typeof data.biography === 'string' && //controllo biografia 
    'image' in data && typeof data.image === 'string' && //controllo immagine
    'most_famous_movie' in data &&

    //qui come visto in correzione vado a verificare che la mia tuple rispecchia
    //le caratteristiche di dato che mi servono 

    data.most_famous_movie instanceof Array &&
    data.most_famous_movie.length === 3 &&
    data.most_famous_movie.every(m => typeof m === 'string') &&
    'awards' in data && typeof data.awards === 'string' && //controllo premi
    'nationality' in data && typeof data.nationality === 'string' //controllo nazionalità
  ) {
    return true
  }

  return false;

}

async function getActress(id: number): Promise<Actress | null> {

  try {
    const response = await fetch(`URL_API/actresses/${id}`)
    if (!response.ok) {
      throw new Error(`ERRORE HTTP ${response.status}:${response.statusText}`);
    }
    const data: unknown = await response.json()

    if (!isActress(data)) {
      throw new Error("Formato dei dati non corretto");
    }
    return data

  } catch (error) {
    if (error instanceof Error) {
      console.error(`Errore nel recupero dei dati:`, error.message)
    } else {
      console.error('Errore di tipo sconosciuto:', error)
    }
    return null
  }
}

/*📌 Milestone 4
Crea una funzione getAllActresses che chiama:

GET /actresses
La funzione deve restituire un array di oggetti Actress.

Può essere anche un array vuoto. */


async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch(`URL_API/actresses`)
    if (!response.ok) {
      throw new Error(`ERRORE HTTP ${response.status}:${response.statusText}`);
    }
    const data: unknown = await response.json()

    if (!(data instanceof Array)) {
      throw new Error("Formato dei dati non corretto");
    }
    const filteredDataActress: Actress[] = data.filter(a => !isActress(a))
    return filteredDataActress

  } catch (error) {
    if (error instanceof Error) {
      console.error(`Errore nel recupero dei dati:`, error.message)
    } else {
      console.error('Errore di tipo sconosciuto:', error)
    }
    return []
  }
};

/*📌 Milestone 5
Crea una funzione getActresses che riceve un array di numeri (gli id delle attrici).

Per ogni id nell’array, usa la funzione getActress che hai creato nella Milestone 3 per recuperare l’attrice corrispondente.

L'obiettivo è ottenere una lista di risultati in parallelo, quindi dovrai usare Promise.all.

La funzione deve restituire un array contenente elementi di tipo Actress oppure null (se l’attrice non è stata trovata). */

async function getActresses(arrayId: number[]): Promise<(Actress | null)[]> {
  try {
    const promisesOfId = arrayId.map(a => getActress(a))
    const resultOfPromises = await Promise.all(promisesOfId)

    if (!(resultOfPromises instanceof Array)) {
      throw new Error("Formato dei dati non corretto");
    }
    return resultOfPromises

  } catch (error) {
    if (error instanceof Error) {
      console.error(`Errore nel recupero dei dati:`, error.message)
    } else {
      console.error('Errore di tipo sconosciuto:', error)
    }
    return []
  }
}

