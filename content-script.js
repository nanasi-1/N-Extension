'use strict'

let count = 0;

document.body.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        count++;
        if (count === 2) {
            window.open('https://www.nnn.ed.nico/contents/guides/2175/');
            count = 0;
        }
        setTimeout(() => count = 0, 500);
    }
})

window.addEventListener('urlChange', async function() {
    console.log('N予備: urlの変更を検知');
    if(!/https:\/\/www.nnn.ed.nico\/courses\/[0-9]+\/chapters\/[0-9]+/.test(location.href)) return;
    await sleep(500);
    document.querySelectorAll('ul[aria-label="課外教材リスト"]>li').forEach(li => {
        if(li.querySelector('i[type*=rounded]').getAttribute('type') !== 'exercise-rounded') {
            return;
        };
        li.onclick = async function() {
            console.log('N予備校系: 問題がクリックされました');
            await sleep(1000);

            /** @type {Document} */
            const que = document.querySelector("iframe[title=教材]").contentDocument;
            globalThis.que = que;
            console.log(globalThis.que);

            // 回答時に正解か出力するやつ
            que.querySelectorAll('.answers>li').forEach(li => {
                // onclickなのはremoveEventListenerのせい
                li.onclick = async () => {
                    const isFolded = li.closest('li.exercise-item').classList.contains('is-folded');
                    if (!isFolded) {
                        console.log(new Date()); // 区切りとして日付を出力
                        const answers = que.querySelectorAll('.answers > li[data-correct=true]');
                        for (let answer of answers) {
                            if (!answer.classList.contains('answers-selected')) console.log(answer);
                        }
                        console.log(JSON.parse(li.dataset.correct) ? '正解' : '不正解');

                        await sleep(100);
                        const isAll = Array.from(que.querySelectorAll('.answers').values()).every(ul => {
                            return Array.from(ul.childNodes.values()).find(li => li.classList.contains('answers-selected'));
                        });
                        if (isAll) {
                            console.log('回答完了');
                            const arr = [];
                            for (let answer of answers) {
                                if (!answer.classList.contains('answers-selected')) {
                                    arr.push(answer.parentElement.previousSibling.innerText);
                                }
                            }
                            alert(arr.length ? `間違っている問いがあります:\n${arr.join('\n')}` : '間違っている問いはありません');
                        }
                    }
                };
            });

            // 間違っている問いがあるかどうかチェッカー
            que.querySelector('.evaluate-button').onclick = () => {
                console.log('回答しました');
                const answers = que.querySelectorAll('.answers > li[data-correct=true]');
                const arr = [];
                for (let answer of answers) {
                    if (!answer.classList.contains('answers-selected')) {
                        arr.push(answer.parentElement.previousSibling.innerText);
                    }
                }
                alert(arr.length ? `間違っている問いがあります:\n${arr.join('\n')}` : '間違っている問いはありません');
            };
        }
    });
});

// bodyの変化を検知
let oldUrl = '';
const observer = new MutationObserver(e => {
    if(oldUrl !== location.href) {
        window.dispatchEvent(new CustomEvent('urlChange'));
    }
    oldUrl = location.href;
});
observer.observe(document.body, {childList: true, subtree: true});

async function sleep(sec) { 
    return new Promise(resolve => setTimeout(resolve, sec)); 
}
