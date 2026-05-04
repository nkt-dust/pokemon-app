// ReactのuseStateという道具を借りてくる。useStateは、「情報の保管場所」と「その情報を書き換えるボタン」の両方を作る関数。
import { useState } from"react";
// SeachBarという部品をSearchBarファイルから借りてくる
import SearchBar from "./SearchBar";
import PokemonCard from "./PokemonCard";
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
      <button>バトル開始</button>
     )}
    </div>
  );
}
// Ａｐｐ関数という部品をほかのファイルでも使えるように公開する
export default App;
