import test from 'node:test';import assert from 'node:assert/strict';import {QUESTIONS,judge,dailyQuestions,reward,localDate} from '../src/engine.js';
test('daily rooms are stable, distinct, and vary across dates',()=>{const a=dailyQuestions('2026-10-13');assert.deepEqual(a,dailyQuestions('2026-10-13'));assert.equal(new Set(a.map(q=>q.id)).size,5);assert.notDeepEqual(a,dailyQuestions('2026-10-14'));});
test('aliases and capitalization accepted; invalid answers rejected',()=>{assert.equal(judge(QUESTIONS[0],'  CZECH Republic ').valid,true);assert.equal(judge(QUESTIONS[0],'Spain').valid,false);assert.equal(judge(QUESTIONS[0],'').points,0);});
test('every curated answer and alias resolves with its assigned points',()=>{for(const q of QUESTIONS)for(const [answer,points,...aliases]of q.answers)for(const value of [answer,...aliases])assert.equal(judge(q,value).points,points);});
test('risk rewards rise through five chambers',()=>{assert.equal(reward(80,0),80);assert.equal(reward(80,4),160);});
test('calendar formatting uses local date components',()=>assert.equal(localDate(new Date(2026,0,2,12)),'2026-01-02'));
