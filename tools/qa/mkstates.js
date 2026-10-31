// Готовит тестовые состояния: state-base (после онбординга), state-live (идёт тренировка), state-tr (тренер + клиент)
const {open,active}=require('./lib');const {runOnb}=require('./onbauto');const fs=require('fs');
const dump=p=>p.evaluate(()=>Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])));
(async()=>{
 {const {b,p,log}=await open();await runOnb(p,log,false);await p.waitForTimeout(3000);fs.writeFileSync('state-base.json',JSON.stringify(await dump(p)));if(log.length)console.log('ONB LOG',log);await b.close();}
 const base=JSON.parse(fs.readFileSync('state-base.json'));
 {const {b,p}=await open({state:base});let f=await active(p);if(!(await f.getByText('Начать тренировку').first().isVisible().catch(()=>false))){/* день отдыха: старт из «Тренировки» */await f.locator('button.tab').nth(1).click();await p.waitForTimeout(1300);f=await active(p);await f.getByText('Ваши первые тренировки').first().click();await p.waitForTimeout(900);await f.getByText('Кор: основа').first().click();await p.waitForTimeout(1300);await f.click('#cGo');}else await f.getByText('Начать тренировку').first().click();await p.waitForTimeout(2500);f=await active(p);await f.click('#lAll');await p.waitForTimeout(1500);fs.writeFileSync('state-live.json',JSON.stringify(await dump(p)));await b.close();}
 {const {b,p}=await open({state:base});let f=await active(p);await f.locator('button.tab[aria-label="Тренер"]').click();await p.waitForTimeout(1300);f=await active(p);await f.getByText('Я тренер: добавить клиента').click();await p.waitForTimeout(900);await f.fill('#clN','Анна QA');await f.getByText('Женский',{exact:true}).click();await f.click('#dOk');await p.waitForTimeout(2000);fs.writeFileSync('state-tr.json',JSON.stringify(await dump(p)));await b.close();}
 console.log('states ready');
})();
