console.log('N予備校の教材を全画面表示: 拡張機能が実行されました');

function main() {
    'use strict';
    const go = document.querySelector('[aria-label="教材モーダル"]');
    if (go) {
        // iframeタグ
        const outerIFrame = document.querySelector('iframe[title="教材"]');
        const innerIFrame = outerIFrame.contentDocument.querySelector('iframe#iframe');
        
        const url = innerIFrame.src.replace(/\bcontent\b/, '');
        console.log(`全画面のページを見つけました。${url} に移動します。`)
        return url;
    }
}

main();