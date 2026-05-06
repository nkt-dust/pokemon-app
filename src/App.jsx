// ReactのuseStateという道具を借りてくる。useStateは、「情報の保管場所」と「その情報を書き換えるボタン」の両方を作る関数。
import { useState } from"react";
// SeachBarという部品をSearchBarファイルから借りてくる
import SearchBar from "./SearchBar";
import PokemonCard from "./PokemonCard";
import BattleArena from "./BattleArena";
// appという関数
// 入力欄の名前のポケモンのデータを探してきて、画像名前攻撃を表示する。
function App(){
  // ユーザーの入力欄への入力。初期は空欄なので（""）になっている。「input=現在の入力欄に打ち込まれている文字」「setInput=更新関数」
  const [input,setInput]=useState("");
  // 「null=データが存在していないこと（まだ何も検索していない）→nullにすることで、（データがまだない時）と（空のデータが返ってきたとき）を区別できる」
  // 「pokemon=探してきた現在のポケモンのデータ」「setPokemon=pokemonの中身を書き換えるためのボタン」
  const [pokemon,setPokemon]=useState(null);
  // 通信中かどうか。初期は通信していないので「false」
  const [loading,setLoading]=useState(false);
//  エラーが起こるとエラーメッセージを表示。初期はエラーなし
  const [error,setError]=useState(null);
  // 選択されたポケモンたちを記憶する箱、追加されたら自動で画面にも反映。最初は誰もいないので、空の配列（[]）
  const [selected,setSelected]=useState([]);
  // バトルログを管理する箱。最初は空の配列（[]）
  const [battleLog,setBattleLog]=useState([]);
   // ポケモンのデータを探してくる関数。「asyncを宣言することででawait（処理が終わるまで待つ＜次の行に進まない＞）を使える」
  async function searchPokemon(){
    // ユーザーの入力欄への入力が空なら、次のコードへ進まず進行を返す（通信しない）
    if(input==="")return;
    // 通信中かどうかの状態。通信状態にすることでユーザーに知らせるようにできる。（loadingの状態をtrueにして画面を更新）
    setLoading(true);
    // 検索する度に、エラー状態を異常なしにする（リセット）
    setError(null);
    // ｛｝内の通りに一度動かしてみる（tryしてみる）。→どこかでエラーが発生すると、catchへと飛ぶ。
    // 自動発生（jsが自動的に判定するエラー）や手動発生（throe new Errorのように手動でエラー判定を作成）でエラーが発生すると
    // エラーの塊がcatch(e)のeへと投げ込まれる。（eはjsが自動的に生成してくれる箱）→エラーが発生してeへと投げ込まれると、それ以降のtryは無視されてワープする
    try{
      // ポケモンAPIからユーザーの入力したポケモンを検索→データを取ってきてresの箱へ入れる。この処理が終わるまで待機する（await）
      // 「input.toLowerCase=ユーザーの入力欄へ入力した文字を小文字に変換」→URLへと埋め込み、検索。
      const res=await fetch(`https://pokeapi.co/api/v2/pokemon/${input.toLowerCase()}`);
      // 「res.ok=サーバー（PokeAPI）と通信した結果、データと共に返ってくるステータスコードが２００番台（成功・問題なし）ならtrueを返す
      // （400・500番台は失敗） →＜！＞がついているため、trueかfalseか反転する。失敗の時にエラー判定、テキスト表示」
      // 「fetchは通信（サーバーとのやり取り→なにか返答があれば成功とみなす）のみなので、返ってきたデータによってエラー判定をする必要がある」
      // 「throw new Error=エラーだと判定→エラー情報を投げる」
      // サーバーとの通信結果が問題なし（true）なら下に進む。問題があれば、エラー判定をしてテキストを表示。
      // エラーが発生した原因によっては、英語のテキストが(e.message)に情報としてeに送られることがあるため、日本語で示すとユーザーに親切
      if(!res.ok)throw new Error("ポケモンが見つかりませんでした");
      // ポケモンAPIからの情報（res）を（.json（））でjs語へ翻訳（オブジェクト形式にしてjsで使いやすくする）
      // .jsonはjsonに変換するという関数（メソッド）resに対してjson化(jsで読めるように翻訳)
      const data=await res.json();
      // pokemonに取ってきたデータが入り、画面が更新される。
      setPokemon(data);
      // 「e=error(エラーの情報の塊→Error("")のなかのテキスト(e.message)とエラーの種類（e.name）が入っている」
      // try以下の部分（通信）でエラーが発生すると、
    }catch(e){
      // setError関数の実行。「e.messageはthrow new Error（""）のテキスト」
      setError(e.message);
      // setPokemon関数にnull(データが存在しない)を送って実行する。
      setPokemon(null);
    }
      // 通信終了。（loadingの状態をfalseにして画面を更新）
      setLoading(false);
  }
  // selectPokemonという道具。検索したポケモンのデータを材料（引数）にもらう
  function selectPokemon(pokemon){
    // 選ばれたポケモンが２以上なら以下は実行しない。
    if(selected.length>=2)return;
    // すでに選ばれたポケモンのリストの中に、some()の条件に合うポケモンがいるかチェック
    // 「p=pokemon」すでに選ばれたポケモンの中に新しく選ばれたポケモンと同じ名前があるかチェック。すでにいたらリストに追加しない（return）
    if(selected.some(p=>p.name===pokemon.name))return;
    // setSelected関数の実行（画面の更新）。今のselectedリストの中身を全部出して、新しいポケモンを追加して新しいリストを作る。その後画面の更新。
    setSelected([...selected,pokemon]);
  }
  // バトル開始ボタンが押されたら 以下の戦闘が実行される
  function startBattle(){
    // 選択された一匹目と二匹目のポケモンのhpをhp1,hp2の箱へそれぞれ入れる。「stats[0]=能力値の最初の要素」hpは増減するため、letへ入れる。
    let hp1=selected[0].stats[0].base_stat;
    let hp2=selected[1].stats[0].base_stat;
    // 選択されたポケモンたちの攻撃力の値を持ってきてatk1,atk2の箱へ入れる
    const atk1=selected[0].stats[1].base_stat;
    const atk2=selected[1].stats[1].base_stat;
    // 同様にポケモンの名前も持ってくる
    const name1=selected[0].name;
    const name2=selected[1].name;
    // 戦闘ログが入る空の配列の箱。
    const log=[];
    // ターンは１から始まる。
    let turn=1;
    // 選ばれたポケモン２匹のhpがどちらも０を超えていたら以下を繰り返す。二匹目とも倒れていない時は繰り返す
    while(hp1>0&&hp2>0){
      // ターン数が５０を超えたら強制終了
      if(turn>50) break;
      // １匹めのポケモンから２匹目のポケモンへの攻撃
      hp2=hp2-atk1;
      // 戦闘ログの配列にログを一行追加する（push）。「ターン○○：○○の攻撃！○○に○○のダメージ（のこりHP：○○）」と表示。HPは０か計算後の大きい方が表示。
      log.push(`ターン${turn}:${name1}の攻撃！${name2}に${atk1}のダメージ（残りHP:${Math.max(0,hp2)}）`);
      // 攻撃を受けた２匹目のポケモンのHPが0以下になったら強制終了（戦闘終了）
      if(hp2<=0)break;
      // ２匹目から一匹目への攻撃
      hp1=hp1-atk2;
      // 戦闘ログ。
      log.push(`ターン${turn}:${name2}の攻撃！${name1}に${atk2}のダメージ（残りHP:${Math.max(0,hp1)}）`);
      // ターン数を１ずつ増やす
      turn++;
    }
    // どちらかが倒れるか、ターン数が５０を超えたら（引分け）以下の処理へ移る。１匹目のポケモンのHPが０を超えていたら、1匹めの勝利。
    if(hp1>0){
      // 勝利ログを戦闘ログの箱（配列）へ追加
      log.push(`🏆${name1}の勝ち！`);
      // 一匹目のHPが0以下で二匹目が倒れていなかったら、二匹目の勝利
      }else if(hp2>0){
        log.push(`🏆${name2}の勝ち！`);
        // ターン数が５０を超えたら引き分けにしたい？？？？
      }else{
        log.push(`引き分け！`);
      }
      // setBattleLog関数を実行して、画面を更新して戦闘ログを表示
      setBattleLog(log);
    }
    // バトル関連の状態をリセットする。
  function resetBattle(){
      // 選ばれたポケモンをリセット（配列を空にして更新）
    setSelected([]);
      // 戦闘ログを空にして更新
    setBattleLog([]);
      // 検索したポケモンをなしにして更新。ポケモンカードも消える。
    setPokemon(null);
    }
  
  // 画面表示の設計図。上記のsearchPokemonをもとに、場合に応じて、「入力待ち」、「読み込み中」、「検索結果」の画面を表示する。
  return(
    // 全体の外枠（すべての画面の部品が入っている大きな箱）
    <div>
      {/* 見出しのテキスト */}
      <h1>ポケモン図鑑</h1>
      {/* 入力欄。SearchBarの部品を借りる（親＜ここ＞から子＜SearchBar＞へ道具を貸す）*/}
      <SearchBar 
      // Props(小道具)。親から子へデータ（道具）を渡す窓口。親から子へとしかデータは渡せない。左が子が受け取るときのラベル、右が親のデータ（道具）の名前
      // 現在の文字を親から子へと知らせる
      input={input}
      // 「onChangeInput=子の受け取る名前」SearchBarのonChangeInputでsetInputという道具を使えるようになる。
      onChangeInput={setInput}
      // searchPokemonという道具を子へと渡す
      onSearch={searchPokemon}
     />
      {/* loadingが真(true)のとき「読み込み中...」の文字が表示される */}
     {loading&&<p>読み込み中...</p>}
      {/* エラーと判定されると（true）eroorのテキスト（e.message）が赤色で表示される */}
     {error&&<p style={{color:"red"}}>{error}</p>}
      {/* 探してきたポケモンのデータがあれば、以下を画面に表示 */}
     {pokemon&&(
      // PokemonCard部品の、pokemonにはpokemnが入る　onSelectにはselectPokemonが入る。propsの受け渡し。
      <PokemonCard pokemon={pokemon} onSelect={selectPokemon}/> 
     )}
     {/* 選択されたポケモンが、０を超えていれば（ポケモンが1匹でも選ばれていれば）、以下を表示。 */}
     {selected.length>0&&(
      // 表示部分
      <div>
        <h2>選択中のポケモン</h2>
        {/* 選択されたリストの中身すべてに加工をしていく。「p=ポケモン一匹一匹」「iはその管理番号」
        ポケモンの名前を管理番号順に画面に並べる */}
        {selected.map((p,i)=>(
          <span key={i}>{p.name} </span>
        ))}
      </div> 
     )}
     {/* 選ばれたポケモンがちょうど2匹ならバトル開始ボタンを表示。 */}
     {selected.length===2&&(
      <div>
        {/* 押すとstartBattleが実行されるバトル開始ボタン */}
        <button onClick={startBattle}>バトル開始</button>
        {/* BattleArena部品へ素材と道具（fighter1,fighter2,onReset）<props>を渡して、戦闘エリアの表示をしてもらう */}
        <BattleArena
          fighter1={selected[0]}
          fighter2={selected[1]}  
          onReset={resetBattle}
            />  
      </div>
     )}
     {/* 戦闘ログが１行以上だったら「バトルログ」というテキストを表示 */}
     {battleLog.length>0&&(
      // 「バトルログ」のデザイン
      <div　className="battle-log">
        <h3>バトルログ</h3>
        {/* battleLogの配列の袋から戦闘からひとつずつ取り出して、一行のテキスト（log）と番号（i）のラベルをつけて、新しい配列を作る
         →そのままREactに渡して画面に表示*/}
        {battleLog.map((log,i)=>(
          // 「i」の番号ごとに＜ｐ＞（テキスト1行）に変換する。その番号の文字列のlog(テキスト)を表示する
          <p key={i}>{log}</p>
        ))}
        </div>
     )}
    </div>
  );
}
// Ａｐｐ関数という部品をほかのファイルでも使えるように公開する
export default App;