import {describe,expect,test} from 'vitest';
import {parseLang,translate} from './i18n-rules';
describe('language choice',()=>{
 test('Greek is the default when nothing or something unknown is stored',()=>{expect(parseLang(null)).toBe('el');expect(parseLang('fr')).toBe('el');});
 test('a stored English choice is kept',()=>{expect(parseLang('en')).toBe('en');});
 test('English shows the English text, Greek shows the Greek text',()=>{expect(translate('en','Σβήσε','Wipe')).toBe('Wipe');expect(translate('el','Σβήσε','Wipe')).toBe('Σβήσε');});
 test('sample stories have English versions',()=>{expect(translate('en','Συνταξιούχος στον Πειραιά — λογαριασμός νερού τριμήνου.')).toBe('Pensioner in Piraeus — quarterly water bill.');});
});
