// BattleArenaという部品。親からfighter1,fighter2,という素材（データ）とonResetという道具を借りる
function BattleArena({fighter1,fighter2,onReset}){
    // 以下の設計図を返す。関数の結果を外に伝えてくれる。
    return(
        // おおきな箱（全体）のデザイン。
        <div className="battle-arena">
            <h2>⚔バトル</h2>
            {/* 小さな箱。それぞれのポケモンの表示部分のデザイン */}
            <div className="fighters">
                <div>
                    {/* 一匹目のポケモンの表示、名前、画像、HP、攻撃それぞれ親のfighter1という箱（データの塊）からもらう */}
                    <h3>{fighter1.name}</h3>
                    <img src={fighter1.sprites.front_default} alt={fighter1.name} />
                    <p>HP:{fighter1.stats[0].base_stat}</p>
                    <p>攻撃:{fighter1.stats[1].base_stat}</p>
                </div>
                {/* 真ん中に「VS」の表示、そのデザイン */}
                <div style={{alignSelf:"center",fontSize:"32px"}}>VS</div>
                <div>
                    {/* 二匹目のポケモンの表示、一匹目と同じ */}
                    <h3>{fighter2.name}</h3>
                    <img src={fighter2.sprites.front_default} alt={fighter2.name} />
                    <p>HP:{fighter2.stats[0].base_stat}</p>
                    <p>攻撃:{fighter2.stats[1].base_stat}</p>
                </div>
            </div>
            {/* 最初からやり直すボタン。自動で感知して戦闘をやり直す（onResetの実行） */}
            <button onClick={onReset}>最初からやり直す</button>
        </div>
    );
}

export default BattleArena;