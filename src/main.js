const $siteList = $('.siteList');
const $lastLi = $siteList.find('li.last');
const webList = localStorage.getItem('website-list');  //  本地存储
const webListObject = JSON.parse(webList);
const hashMap = webListObject || [    //  存在就用xObject
    { logo: 'A', url: 'https://www.acfun.cn' },
    { logo: 'B', url: 'https://www.bilibili.com'}
];
const simplifyUrl = (url) => {    //简化url
    return url.replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace(/\/.*/,'');   // 删除/ 开头的内容
}
let render = () => {     // 添加事件并渲染
    $siteList.find('li:not(.last)').remove();  // 删掉之前的，重新渲染
    hashMap.forEach((node,index) => {
        const $li = $(`<li>
            <div class="site">
                <div class="logo">${node.logo}</div>
                <div class="link">${simplifyUrl(node.url)}</div>
                <div class='close'>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-close"></use>
                    </svg>
                </div>
            </div>
        </li>`).insertBefore($lastLi);   // 插入lastLi 前面
        $li.on('click', '.close', (e) => {    //  关闭按钮
            e.stopPropagation();   //  阻止冒泡
            hashMap.splice(index, 1);
            render();
        });
        $li.on('click',() => {
            window.open(node.url);
        })
    })
}
render();     //  刚开始要渲染一次
$('.addButton').on('click', () => {     // 点击添加网站
    let url = window.prompt('请问你要添加的网址是?');
    if (url !== null) {
        if (url.indexOf('https://') === -1) {
            url = 'https://' + url;
        }
    } else{
        return;
    }
    hashMap.push({
        logo: simplifyUrl(url)[0],
        url: url
    });
    render();    //  渲染
})
window.onbeforeunload = () => {    // 网页关闭或切换网址时触发
    const string = JSON.stringify(hashMap);
    window.localStorage.setItem('website-list', string);   // 在本地存储一个x变量
}
$(document).on('keypress',(event) => {   // 键盘打开网址
    const {key} = event;
    for (let i = 0;i < hashMap.length;i++){
        if(hashMap[i].logo.toLowerCase() === key){
            window.open(hashMap[i].url);
        }
    }
})
