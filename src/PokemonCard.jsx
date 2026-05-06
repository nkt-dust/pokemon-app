// PokemonCardという部品の関数。親（App）から(pokemo)と(onSelect)という道具（props）を借りる
function PokemonCard({pokemon,onSelect}){
    // 以下の設計図を返す。
    return(
        // PokemonCard全体のデザインの設定
        <div className="card">
            {/* 見出し、ポケモンの名前の表示 */}
            <h2>{pokemon.name}</h2>
            {/* APIからのデータの中から指定のポケモンの画像を表示。PC達にも、検索したポケモンの画像を表示しているとわかるようにする */}
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            {/* ポケモンの数値ステータスの表示。（APIからのデータの中から） */}
            <p>HP:{pokemon.stats[0].base_stat}</p>
            <p>攻撃:{pokemon.stats[1].base_stat}</p>
            {/* 選択ボタンをクリックされると自動で感知し、onSelect道具を使う。 */}
            <button onClick={()=>onSelect(pokemon)}>このポケモンで戦う</button>
        </div>
    );
}
// PokemonCardの部品をほかのファイルで使えるように公開する。
export default PokemonCard;