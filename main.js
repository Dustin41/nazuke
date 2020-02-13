'use strict'
{
  //スマホならタップ、pcならクリック
  const mytap = window.ontouchstart===null?"touchstart":"click";

  //どの処理をしているか（組み合わせ:a  アナグラム:b  ランダム:c）
  let playLabel;


  //*****組み合わせ********************
  
  //組み合わせデータ一覧
  //前に付けるひらがな
  const frontHira = [
    'さわやか','ふんわり','おれの','いけいけ','がっつ','まじまじ','ごっつ','ぼくらの','がっつり','どっと','れっつ','どんどん','まっくす','へっちゃら',
    'こんんなに','ぽっちゃり','もっさり','おれの','これであなたも','きみの','なぞの','ある','とある','かいぞく','へんな','さぶ','しょうぐん','むらさき',
    'まっかな','ふわっと','ゆるーい','びっぐ','きゃっつ','ごごご','すごい','あらたな','たいしょう','へいせい','れいわ','うどん','どんだけ','ぞろぞろ',
    'むきむき','ばらばら','はっぴー','ふじ','あい','あいるびー','まい','まったり','ぷろ','かけだし','お','いと','あなたの','もと','みるく'
  ];

  //後ろに付けるひらがな
  const backHira = [
    'せんせい','だぞ','だましい','ろっく','ぱーてぃー','ぶっくす','ろっく','ろぐ','いずむ','あんてな','こんぱす','おかし','せんべい','びーる','めも',
    'しょてん','でんわ','はらっぱ','ぜろ','ばっく','ですよ','めもめも','ぶろぐ','みっくす','ーず','じま','もよう','いちみ','むすこ','おとこ','おっさん',
    'いぬ','たいしょう','かぞく','しき','よそう','せいかつ','るーてぃん','っち','せっと','ほう','かいぎ','でんわ','いちらん','しき','かい','ですがなにか',
    'もの','ごはん','しる','いしき','しくみ','きっさてん','しょくぎょう','かいかく'
  ];

  //前に付けるカタカナ
  const frontKata = [
    'ハイパー','スーパー','スパイラル','メタル','ゴールド','シルバー','メンズ','ニュース','アップ','ダウン','レア','ホイップ','ファンクション','ナンバー',
    'モノ','マリン','ヴァース','アイコン','ノーマル','ジャイアント','アマゾン','ビッグ','ゴッド','モンスター','サマー','シンプル','ワークアウト','ジャパン',
    'チェンジ','ロッキン','マーベル','アイス','ホット','ランダム','ゲーム','マネー','ボイス','ジャンプ','スリープ','ジョブ','スリップ','インスタ ','ウェザー',
    'エブリー','ライン','ワン','セカンド','トップ','ギア','キャプテン'
  ];

  //後ろに付けるカタカナ
  const backKata = [
    'ログ','アンテナ','トップ','ジャンプ','ヘブン','アップ','ブック','ゼロ','ポケット','モンスター','ドア','スマッシュ','クラブ','カット','プリント',
    'チューナー','フォワード','バンク','アカデミー','ネット','ドットコム','コマース','タウン','ストア','チャンネル','ピックス','ビデオ','ルーム','ネクスト',
    'リーチ','チェック','フライヤー','ロワイヤル','アウト','ジャーナル','スパイラル','ナイン','チェンジャー','クラッシュ','クラフト','グランプリ','テイル',
    'ナイツ','フラット','オーバー','モバイル','ストライク','マシン','シティ','アース'
  ];

  //前に付ける英語
  const frontAlf = [
    'hyper','ultra','app','mr','over','gold','silver','ice','hot','workout','japan','job','rock','super','menz','giant',
    'summer','marin','simple','number','news','down','rear','top','bottom','one','gier','god','mavel','chenge','voice','face',
    'money','slack','game','comic','e-','weather','clash','knives','boat','navi','metal','up','max','min','nomal','every',
    'icon','jamp','an','ab','abc','lets'
  ];

  //後ろに付ける英語
  const backAlf = [
    'log','antenna','strike','poket','binx','mobile','out','net','com','journal','commerce','books','monster','academy',
    'smash','print','club','bank','nine','store','check','change','flat','zero','cut','pro','door','reach','channel','town',
    'picks','spiral','macine','earth','city','teil','tube','gram','tv','note','tell','lock','tunar','walk','bang','mee','park',
    'zon','camera','flyer'
  ];


  //組み合わせボタン
  const combiBtn = document.getElementById('combiBtn');
  combiBtn.addEventListener(mytap, () => {
    const combiName = sanitize(document.querySelector('input[name="combiName"]').value);
    strCheck(combiName, areaA, "areaA", 'input[name="combiName"]');
    if (errorLabel) {
      return;
    }
    combi();
    modalOpen();
  });

  //combi関数
  function combi() {
    let str = '';
    const lang1 = document.getElementsByName('lang1');
    for (let i = 0; i < lang1.length; i++) {
      if (lang1[i].checked) {
        str = lang1[i].value;
        break;
      }
    }

    modalReset();

    switch (str) {
      case 'hira':
        createCombi(frontHira, backHira);
        break;
      case 'kata':
        createCombi(frontKata, backKata);
        break;
      case 'alf':
        createCombi(frontAlf, backAlf);
        break;
      default:
        break;
    }

    playLabel = 'a';
  }

  //前後に付ける方法
  function createCombi(front, back) {
    const combiName = sanitize(document.querySelector('input[name="combiName"]').value);
    for (let i = 0; i < 5; i++) {
      const li = document.createElement('li');
      li.textContent = front[Math.floor(Math.random() * front.length)] + combiName;
      resultArea.appendChild(li);
    }
    for (let i = 0; i < 5; i++) {
      const li = document.createElement('li');
      li.textContent = combiName + back[Math.floor(Math.random() * back.length)];
      resultArea.appendChild(li);
    }
  }




  //*****アナグラム*******************
  
  //アナグラムボタン
  const anaBtn = document.getElementById('anaBtn');
  anaBtn.addEventListener(mytap, () => {
    const ana = sanitize(document.querySelector('input[name="anaName"]').value);
    strCheck(ana, areaB, "areaB", 'input[name="anaName"]');
    if (errorLabel) {
      return;
    }
    const splitedAna = ana.split('');

    modalReset();

    for (let i = 0; i < 10; i++) {
      shuffle(splitedAna);
      const resultAna = splitedAna.join('');
      const li = document.createElement('li');
      li.textContent = resultAna;
      resultArea.appendChild(li);
    }
    playLabel = 'b';
    modalOpen();
  });

  //シャッフル関数
  function shuffle(arr) {
    for(let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    return arr;
  }



  //*****ランダム*******************
  
  const hira = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽぁぃぅぇぉっゃゅょ';
  const kata = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂズデドバビブベボパピプペポァィゥェォッャュョヴ';
  const alf = 'abcdefghijklmnopqrstuvwxyz';

  //ランダムボタン
  const ranBtn = document.getElementById('ranBtn');
  ranBtn.addEventListener(mytap, () => {
    random();
  });

  function random() {
    let str = '';
    const lang2 = document.getElementsByName('lang2');
    for (let i = 0; i < lang2.length; i++) {
      if (lang2[i].checked) {
        str = lang2[i].value;
        break;
      }
    }

    modalReset();

    switch (str) {
      case 'hira':
        createRandom(hira);
        break;
      case 'kata':
        createRandom(kata);
        break;
      case 'alf':
        createRandom(alf);
        break;
      default:
        break;
    }

    playLabel = 'c';
    modalOpen();
  }

  //ランダムな組み合わせをつくる
  function createRandom(lang) {
    const len = document.querySelector('select[name="ranName"]').value;
    let ranStr = '';
    for (let i = 0; i < 10; i++) {
      for(let i = 0; i < len; i++) {
        ranStr += lang[Math.floor(Math.random() * lang.length)];
      }
      const li = document.createElement('li');
      li.textContent = ranStr;
      resultArea.appendChild(li);
      ranStr = '';
    }
  }

  

  // *****共通************************

  //結果表示
  function appendResult (element) {
    while (resultArea.firstChild) {
      resultArea.removeChild(resultArea.firstChild);
    }
    for(let i = 0; i < 10; i++) {
      const li = document.createElement('li');
      li.textContent = element;
      element.appendChild(li);
      i++;
    }
  }

  //結果表示時のウィンドウと背景マスク
  const mask = document.getElementById('mask');
  const modal = document.getElementById('modal');
  const resultArea = document.getElementById('resultArea');

  //モーダルウィンドウの表示
  function modalOpen() {
    mask.classList.remove('hidden');
    modal.classList.remove('hidden');
  }

  //モーダルウィンドウの非表示
  function modalClose() {
    mask.classList.add('hidden');
    modal.classList.add('hidden');
  }

  //モーダルウィンドウの中身をリセット
  function modalReset() {
    while (resultArea.firstChild) {
      resultArea.removeChild(resultArea.firstChild);
    }
  }

  //もう一度つくる
  const remake = document.getElementById('remake');
  remake.addEventListener(mytap, () => {
    remakeResult();
  });

  function remakeResult () {
    if (window.ontouchstart == null) {
      switch (playLabel) {
        case 'a':
          combiBtn.click();
          break;
        case 'b':
          anaBtn.click();
          break;
        case 'c':
          ranBtn.click();
          break;
        default:
          break;
        }
    } else {
      switch (playLabel) {
        case 'a':
          alert('aaaa');
          combiBtn.touchstart();
          alert('miss');
          break;
        case 'b':
          anaBtn.touchstart();
          break;
        case 'c':
          ranBtn.touchstart();
          break;
        default:
          break;
        }
      }
    }


  //戻る
  const back = document.getElementById('back');
  back.addEventListener(mytap, () => {
    modalClose();
  });

  //ウィンドウ外をクリックで戻る
  mask.addEventListener(mytap, function(){ modalClose() }, false);

  //何も入力されていない時のエラー
  let errorLabel;
  function strCheck(name, area, id, inputName) {
    const input = document.querySelector(inputName);
    area = document.getElementById(id);
    while (area.childNodes[1]) {
      area.removeChild(area.childNodes[1]);
      input.classList.remove('error');
    }
    if (name.length == 0) {
      const p = document.createElement('p');
      p.textContent = '文字を入力してください';
      p.classList.add('red');
      area.appendChild(p);
      input.classList.add('error');
      errorLabel = true;
      return;
    }
    errorLabel = false;
  }

  //サニタイズ
  function sanitize(str) {
    return String(str).replace(/&/g,"&amp;")
      .replace(/"/g,"&quot;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;");
  }

  //スムーススクロール
  $(function(){
    $('a[href^=#]').click(function(){
        const speed = 500;
        const href= $(this).attr("href");
        const target = $(href == "#" || href == "" ? 'html' : href);
        const position = target.offset().top;
        $("html, body").animate({scrollTop:position}, speed, "swing");
        return false;
    });
  });

}
