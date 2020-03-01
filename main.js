'use strict'
{
  class Common {   // *****共通クラス************************
    constructor() {
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

      //スマホならタップ、pcならクリック
      this.mytap = window.ontouchstart===null?"touchstart":"click";

      //どの処理をしているか（組み合わせ:a  アナグラム:b  ランダム:c）
      this.playLabel = undefined;

      //フォーム未入力時の判定（未入力:true  入力済み:false）
      this.errorLabel = undefined;

      //結果表示時のウィンドウ
      const modal = document.getElementById('modal');
      const resultArea = document.getElementById('resultArea');

      //ダブルタップズーム禁止
      let lastTouch = 0;
      document.addEventListener('touchend', event => {
        let now = window.performance.now();
        if (now - lastTouch <= 500) {
          event.preventDefault();
        }
        lastTouch = now;
      }, true);

      //もう一度つくるボタン
      const remake = document.getElementById('remake');
      remake.addEventListener(this.getMytap(), () => {
        this.remakeResult(this.getPlayLabel());
      });

      //戻るボタン
      const back = document.getElementById('back');
      back.addEventListener(this.getMytap(), () => {
        this.modalClose();
      });

      //背景マスクをクリックで戻る
      const mask = document.getElementById('mask');
      mask.addEventListener(this.getMytap(), () => {
        this.modalClose()
      });
    }   //ここまで Common constructor

    //以下  Common メソッド

    //getMytap()（pc or スマホ）取得
    getMytap() {
      return this.mytap;
    }

    //playLabelの取得（組み合わせ:a  アナグラム:b  ランダム:c）
    getPlayLabel(label) {
      return this.playLabel;
    }
    //playLabelの変更
    setPlayLabel(label) {
      this.playLabel = label;
    }

    //errorLabelの取得（未入力:true  入力済み:false）
    getErrorLabel(label) {
      return this.errorLabel;
    }
    //errorLabelの変更
    setErrorLabel(label) {
      this.errorLabel = label;
    }

    //もう一度つくる
    remakeResult(e) {
      switch (e) {
        case 'a':
          combinate.combiBtnClick();
          break;
        case 'b':
          anagram.anaBtnClick();
          break;
        case 'c':
          random.ranBtnClick();
          break;
        default:
          break;
      }
    }

    //結果表示
    appendResult(element) {
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

    //モーダルウィンドウの表示
    modalOpen() {
      mask.classList.remove('hidden');
      modal.classList.remove('hidden');
    }

    //モーダルウィンドウの非表示
    modalClose() {
      mask.classList.add('hidden');
      modal.classList.add('hidden');
    }

    //モーダルウィンドウの中身をリセット
    modalClear() {
      while (resultArea.firstChild) {
        resultArea.removeChild(resultArea.firstChild);
      }
    }

    //何も入力されていない時のエラー
    strCheck(name, area, id, inputName) {
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
        this.setErrorLabel(true);
        return;
      }
      this.setErrorLabel(false);
    }

    //サニタイズ
    sanitize(str) {
      return String(str).replace(/&/g,"&amp;")
        .replace(/"/g,"&quot;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;");
    }
  }


  class Combinate {   //*****組み合わせ********************
    constructor() {
      //組み合わせデータ一覧
      const frontHira = [  //前に付けるひらがな
        'さわやか','ふんわり','おれの','いけいけ','がっつ','まじまじ','ごっつ','ぼくらの','がっつり','どっと','れっつ','どんどん','まっくす','へっちゃら',
        'こんんなに','ぽっちゃり','もっさり','おれの','これであなたも','きみの','なぞの','ある','とある','かいぞく','へんな','さぶ','しょうぐん','むらさき',
        'まっかな','ふわっと','ゆるーい','びっぐ','きゃっつ','ごごご','すごい','あらたな','たいしょう','へいせい','れいわ','うどん','どんだけ','ぞろぞろ',
        'むきむき','ばらばら','はっぴー','ふじ','あい','あいるびー','まい','まったり','ぷろ','かけだし','お','いと','あなたの','もと','みるく'
      ];
      const backHira  = [  //後ろに付けるひらがな
        'せんせい','だぞ','だましい','ろっく','ぱーてぃー','ぶっくす','ろっく','ろぐ','いずむ','あんてな','こんぱす','おかし','せんべい','びーる','めも',
        'しょてん','でんわ','はらっぱ','ぜろ','ばっく','ですよ','めもめも','ぶろぐ','みっくす','ーず','じま','もよう','いちみ','むすこ','おとこ','おっさん',
        'いぬ','たいしょう','かぞく','しき','よそう','せいかつ','るーてぃん','っち','せっと','ほう','かいぎ','でんわ','いちらん','しき','かい','ですがなにか',
        'もの','ごはん','しる','いしき','しくみ','きっさてん','しょくぎょう','かいかく'
      ];
      const frontKata = [  //前に付けるカタカナ
        'ハイパー','スーパー','スパイラル','メタル','ゴールド','シルバー','メンズ','ニュース','アップ','ダウン','レア','ホイップ','ファンクション','ナンバー',
        'モノ','マリン','ヴァース','アイコン','ノーマル','ジャイアント','アマゾン','ビッグ','ゴッド','モンスター','サマー','シンプル','ワークアウト','ジャパン',
        'チェンジ','ロッキン','マーベル','アイス','ホット','ランダム','ゲーム','マネー','ボイス','ジャンプ','スリープ','ジョブ','スリップ','インスタ ','ウェザー',
        'エブリー','ライン','ワン','セカンド','トップ','ギア','キャプテン'
      ];
      const backKata  = [  //後ろに付けるカタカナ
        'ログ','アンテナ','トップ','ジャンプ','ヘブン','アップ','ブック','ゼロ','ポケット','モンスター','ドア','スマッシュ','クラブ','カット','プリント',
        'チューナー','フォワード','バンク','アカデミー','ネット','ドットコム','コマース','タウン','ストア','チャンネル','ピックス','ビデオ','ルーム','ネクスト',
        'リーチ','チェック','フライヤー','ロワイヤル','アウト','ジャーナル','スパイラル','ナイン','チェンジャー','クラッシュ','クラフト','グランプリ','テイル',
        'ナイツ','フラット','オーバー','モバイル','ストライク','マシン','シティ','アース'
      ];
      const frontAlf  = [  //前に付ける英語
        'hyper','ultra','app','mr','over','gold','silver','ice','hot','workout','japan','job','rock','common','menz','giant',
        'summer','marin','simple','number','news','down','rear','top','bottom','one','gier','god','mavel','chenge','voice','face',
        'money','slack','game','comic','e-','weather','clash','knives','boat','navi','metal','up','max','min','nomal','every',
        'icon','jamp','an','ab','abc','lets'
      ];
      const backAlf   = [  //後ろに付ける英語
        'log','antenna','strike','poket','binx','mobile','out','net','com','journal','commerce','books','monster','academy',
        'smash','print','club','bank','nine','store','check','change','flat','zero','cut','pro','door','reach','channel','town',
        'picks','spiral','macine','earth','city','teil','tube','gram','tv','note','tell','lock','tunar','walk','bang','mee','park',
        'zon','camera','flyer'
      ];
      //まとめて配列に
      this.combiData = [frontHira, backHira, frontKata, backKata, frontAlf, backAlf];

      //組み合わせボタン
      const combiBtn = document.getElementById('combiBtn');
      combiBtn.addEventListener(common.getMytap(), () => {
        this.combiBtnClick();
      });
    }

    //文字列データ取得
    getCombiData(num) {
      return this.combiData[num];
    }

    combiBtnClick() {
      const combiName = common.sanitize(document.querySelector('input[name="combiName"]').value);
      common.strCheck(combiName, areaA, "areaA", 'input[name="combiName"]');
      if (common.getErrorLabel()) {
        return;
      }
      this.combi();
      common.modalOpen();
    }

    //combi関数
    combi() {
      let str = '';
      const lang1 = document.getElementsByName('lang1');
      for (let i = 0; i < lang1.length; i++) {
        if (lang1[i].checked) {
          str = lang1[i].value;
          break;
        }
      }
      common.modalClear();
      switch (str) {
        case 'hira':
          this.createCombi(this.getCombiData(0), this.getCombiData(1));
          break;
        case 'kata':
          this.createCombi(this.getCombiData(2), this.getCombiData(3));
          break;
        case 'alf':
          this.createCombi(this.getCombiData(4), this.getCombiData(5));
          break;
        default:
          break;
      }
      common.setPlayLabel('a');
    }

    //前後に付ける方法
    createCombi(front, back) {
      const combiName = common.sanitize(document.querySelector('input[name="combiName"]').value);
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
  }


  class Anagram {   //*****アナグラム*******************
    constructor() {
      //アナグラムボタン
      const anaBtn = document.getElementById('anaBtn');
      anaBtn.addEventListener(common.getMytap(), () => {
        this.anaBtnClick();
      });
    }

    anaBtnClick() {
      const ana = common.sanitize(document.querySelector('input[name="anaName"]').value);
      common.strCheck(ana, areaB, "areaB", 'input[name="anaName"]');
      if (common.getErrorLabel()) {
        return;
      }
      const splitedAna = ana.split('');
      common.modalClear();
      for (let i = 0; i < 10; i++) {
        this.shuffle(splitedAna);
        const resultAna = splitedAna.join('');
        const li = document.createElement('li');
        li.textContent = resultAna;
        resultArea.appendChild(li);
      }
      common.setPlayLabel('b');
      common.modalOpen();
    }

    //シャッフル関数
    shuffle(arr) {
      for(let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[j], arr[i]] = [arr[i], arr[j]];
      }
      return arr;
    }
  }


  class Random {    //*****ランダム*******************
    constructor() {
      const hira = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽぁぃぅぇぉっゃゅょ';
      const kata = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂズデドバビブベボパピプペポァィゥェォッャュョヴ';
      const alf = 'abcdefghijklmnopqrstuvwxyz';
      //まとめて配列に
      this.randomData = [hira, kata, alf];

      //ランダムボタン
      const ranBtn = document.getElementById('ranBtn');
      ranBtn.addEventListener(common.getMytap(), () => {
        this.ranBtnClick();
      });
    }

    //文字列データ取得
    getRandomData(num) {
      return this.randomData[num];
    }

    ranBtnClick() {
      let str = '';
      const lang2 = document.getElementsByName('lang2');
      for (let i = 0; i < lang2.length; i++) {
        if (lang2[i].checked) {
          str = lang2[i].value;
          break;
        }
      }
      common.modalClear();
      switch (str) {
        case 'hira':
          this.createRandom(this.getRandomData(0));
          break;
        case 'kata':
          this.createRandom(this.getRandomData(1));
          break;
        case 'alf':
          this.createRandom(this.getRandomData(2));
          break;
        default:
          break;
      }
      common.setPlayLabel('c');
      common.modalOpen();
    }

    //ランダムな組み合わせをつくる
    createRandom(lang) {
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
  }


  const common = new Common();
  const combinate = new Combinate();
  const anagram = new Anagram();
  const random = new Random();
}
