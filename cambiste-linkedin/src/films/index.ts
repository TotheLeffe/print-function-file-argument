import {SceneDef} from '../lib/Stage';
import {film01} from './01';
import {film02} from './02';
import {film03} from './03';
import {film04} from './04';
import {film05} from './05';
import {film06} from './06';
import {film07} from './07';
import {film08} from './08';
import {film09} from './09';
import {film10} from './10';
import {film11} from './11';
import {film12} from './12';
import {film13} from './13';
import {film14} from './14';

/** Le catalogue de la serie. Une entree par film. */
export const FILMS: Record<string, SceneDef[]> = {
  '01': film01,
  '02': film02,
  '03': film03,
  '04': film04,
  '05': film05,
  '06': film06,
  '07': film07,
  '08': film08,
  '09': film09,
  '10': film10,
  '11': film11,
  '12': film12,
  '13': film13,
  '14': film14,
};
