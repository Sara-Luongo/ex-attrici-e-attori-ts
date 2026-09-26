const URL_API = 'http://localhost:3333';

type Persona = {
  id: number,
  name: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string //['URL', ...string[]]
}