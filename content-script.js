'use strict'

window.addEventListener('urlChange', async function() {
    if(!(new RegExp('https://www.nnn.ed.nico/courses/[0-9]+/chapters/[0-9]+/.*')).test(location.href)) return;
    console.log('N予備: 問題のURLを検知');
    await sleep(500);

    /** @type {Document} */
    const que = document.querySelector("iframe[title=教材]")?.contentDocument;
    if(!que) {
        console.info('回答チェッカー：教材が見つからなかったため終了します');
        return;
    }

    // li.onclickに関数を追加
    document.querySelectorAll('ul[aria-label="課外教材リスト"]>li').forEach(li => {
        if(li.querySelector('i[type*=rounded]').getAttribute('type') !== 'exercise-rounded') return;
        li.onclick = () => handle(que);
    });

    // 開いているのが問題なら適用
    if((new RegExp('.*/chapters/[0-9]+/exercise/[0-9]*')).test(location.href)) handle(que);
});

/** @param {Document} que */
async function handle(que) {
    console.log('N予備校系: 問題がクリックされました');
    await sleep(1000);

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
