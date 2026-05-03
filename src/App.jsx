// ReactのuseStateという道具を借りてくる。useStateは、「情報の保管場所」と「その情報を書き換えるボタン」の両方を作る関数。
import { useState } from"react";
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
  // ポケモンのデータを探してくる関数。「asyncを宣言することででawait（処理が終わるまで待つ＜次の行に進まない＞）を使える」
  async function searchPokemon(){
    // ユーザーの入力欄への入力が空なら、次のコードへ進まず進行を返す（通信しない）
    if(input==="")return;
    // 通信中かどうかの状態。通信状態にすることでユーザーに知らせるようにできる。（loadingの状態をtrueにして画面を更新）
    setLoading(true);
    // ポケモンAPIからユーザーの入力したポケモンを検索→データを取ってきてresの箱へ入れる。この処理が終わるまで待機する（await）
    // 「input.toLowerCase=ユーザーの入力欄へ入力した文字を小文字に変換」→URLへと埋め込み、検索。
    const res=await fetch(`https://pokeapi.co/api/v2/pokemon/${input.toLowerCase()}`);
    // ポケモンAPIからの情報（res）を（.json（））でjs語へ翻訳（オブジェクト形式にしてjsで使いやすくする）
    // .jsonはjsonに変換するという関数（メソッド）resに対してjson化(jsで読めるように翻訳)
    const data=await res.json();
    // pokemonに取ってきたデータが入り、画面が更新される。
    setPokemon(data);
    // 通信終了。（loadingの状態をfalseにして画面を更新）
    setLoading(false);
  }
  // 画面表示の設計図。上記のsearchPokemonをもとに、場合に応じて、「入力待ち」、「読み込み中」、「検索結果」の画面を表示する。
  return(
    // 全体の外枠（すべての画面の部品が入っている大きな箱）
    <div>
      {/* 見出しのテキスト */}
      <h1>ポケモン図鑑</h1>
      {/* 入力欄。 */}
      <input 
      // 入力欄の中の実際の文字（value）とReactが管理、記憶する文字（input）を紐づける
      value={input}
      // 「e=イベント（キーボード入力などの情報）」。「e.target.value=入力欄に打ち込まれた文字。（）」「onChange=センサー」
      // 入力欄に文字が入力される（e）と（eを引数に、e.target.valueに対して）、setInputで画面が更新される。
      onChange={e=>setInput(e.target.value)}
      // 入力欄に最初に表示される薄グレーの色のヒント。
      placeholder="例：pikachu"
     />
     {/* 検索ボタンをクリックすると、センサー（onClick）が感知して、(searchPokemon)関数が実行される */}
     <button onClick={searchPokemon}>検索</button>
      {/* loadingが真(true)のとき「読み込み中...」の文字が表示される */}
     {loading&&<p>読み込み中...</p>}
      {/* 探してきたポケモンのデータがあれば、以下を画面に表示 */}
     {pokemon&&(
      // 検索結果の箱。大きな箱の中に入っている。
      <div>
      {/* 探してきたポケモンの名前を表示。 */}
        <h2>{pokemon.name}</h2>
        {/* 探してきたポケモンの画像を表示。「pokemon.sprites=ポケモンＡＰＩが提供する画像のデータ」「.front_default=デフォルトの正面画像 」
        pokemonのspritesのfront_default
        pokemonという探してきたデータの塊が入っている箱から、spritesという画像データの袋を探して、その中の正面画像を取り出す。
        「alt=代替テキスト」画像が読み込めなかったら名前のテキストを表示、読み上げソフトがポケモンの画像があると表示、そのぽけもんの画像が表示されているとわかる。*/}
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        {/* ポケモンのHP,攻撃を表示。APIからかのデータは配列なので、[0]番目でHP、[1]番目で攻撃を表示する。 
        stats=数値データ（ポケモンの能力値リスト）　base_stat=リストの中の基礎ステータス値（このラベルから数値を探す）
        ＡＰＩのデータの中から、ほしいデータ（ＨＰ，攻撃）を探すための書き方。*/}
        <p>HP: {pokemon.stats[0].base_stat}</p>
        <p>攻撃: {pokemon.stats[1].base_stat}</p>
      </div>
     )}
    </div>
  );
}
// Ａｐｐ関数という部品をほかのファイルでも使えるように公開する
export default App;
