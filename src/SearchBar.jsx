// SearchBarという部品。親（App）から(input,onChangeInput,onSearch)という引数（道具）を受け取る。
function SearchBar({input, onChangeInput,onSearch}){
    // 以下の画面の設計図を返す。
    return(
        <div>
            {/* 入力欄 */}
            <input
            // 現在ユーザーが入力欄に打ち込んだ文字をReactで管理・記憶できるようにする
             value={input}
            //  自動的に入力欄への入力を感知し、入力欄のへの文字の入力を画面に反映する。
            onChange={e=>onChangeInput(e.target.value)}
            // ユーザーに分かりやすいように入力欄のヒントを薄いグレーの文字で表示
            placeholder="例：pikachu"
             />
             {/* 検索ボタンをクリックされたら自動で感知し、親からもらった(onSearch)という道具を使ってポケモンの検索を行う。 */}
             <button onClick={onSearch}>検索</button>
        </div>
    );
}
// SearchBarという部品を他のファイルでも使えるように公開する
export default SearchBar;