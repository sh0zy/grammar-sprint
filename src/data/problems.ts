// src/data/problems.ts

export type ProblemType =
  | "mc"        // 4択
  | "fill"      // 穴埋め
  | "reorder"   // 並び替え
  | "writing"   // 英作文
  | "error"     // 正誤
  | "dialogue"  // 英会話穴埋め
  | "choice"    // 選択問題
  | "spelling"; // スペル書き

export type Topic = "perfect" | "modal" | "passive";

export interface Problem {
  id: string;
  type: ProblemType;
  topic: Topic;
  predicted?: boolean;       // 予想問題なら true
  instruction: string;       // 日本語の指示文
  question: string;          // 問題本体（英文・語群など）
  choices?: string[];        // mc / choice 用の選択肢
  tokens?: string[];         // reorder 用（並べ替える語群・シャッフル済み想定）
  answer: string;            // 主たる正解（reorder=並べ替え正解の語順, dialogue=複数空所は " / " 区切り）
  accept?: string[];         // 別解
  hint?: string;
  explanation: string;       // 日本語解説（必須）
  translation?: string;      // 和訳・補足
}

export const TOPIC_LABEL: Record<Topic, string> = {
  perfect: "完了形",
  modal: "助動詞",
  passive: "態",
};

export const TYPE_LABEL: Record<ProblemType, string> = {
  mc: "4択",
  fill: "穴埋め",
  reorder: "並び替え",
  writing: "英作文",
  error: "正誤",
  dialogue: "英会話穴埋め",
  choice: "選択問題",
  spelling: "スペル書き",
};

export const problems: Problem[] = [
  // ============================================================
  // 完了形 (perfect)
  // ============================================================

  // --- 4択 ---
  { id: "pf_mc_01", type: "mc", topic: "perfect",
    instruction: "空所に最も適切なものを選びなさい。",
    question: "I have ___ spent all my money.",
    choices: ["already", "yet", "ago", "since"],
    answer: "already",
    explanation: "現在完了の完了・結果用法。肯定文では already「すでに」を伴うことが多い。",
    translation: "私はもうお金を全部使ってしまった。" },

  { id: "pf_mc_02", type: "mc", topic: "perfect",
    instruction: "空所に最も適切なものを選びなさい。",
    question: "Has Henry arrived there ___?",
    choices: ["already", "yet", "ever", "just"],
    answer: "yet",
    explanation: "yet は疑問文で「もう」の意味。否定文では「まだ」になる。",
    translation: "ヘンリーはもうそこに到着しましたか。" },

  { id: "pf_mc_03", type: "mc", topic: "perfect",
    instruction: "空所に最も適切なものを選びなさい。",
    question: "I have visited Kyoto ___.",
    choices: ["twice", "yesterday", "last week", "ago"],
    answer: "twice",
    explanation: "経験用法。回数を表す twice「2回」は可。yesterday / last week / ago は過去の一点を表すので現在完了とは併用できない。",
    translation: "私は京都を2度訪れたことがある。" },

  { id: "pf_mc_04", type: "mc", topic: "perfect",
    instruction: "空所に最も適切なものを選びなさい。",
    question: "We have lived in this house ___ 1992.",
    choices: ["for", "since", "in", "at"],
    answer: "since",
    explanation: "継続用法。since＋時の一点「〜以来」。",
    translation: "私たちは1992年からこの家に住んでいる。" },

  { id: "pf_mc_05", type: "mc", topic: "perfect",
    instruction: "空所に最も適切なものを選びなさい。",
    question: "The game ___ already begun when we arrived at the stadium.",
    choices: ["has", "had", "have", "is"],
    answer: "had",
    explanation: "過去完了。過去のある時点（arrived）より前にすでに完了していたことを表す。",
    translation: "私たちが競技場に着いた時、すでに試合は始まっていた。" },

  { id: "pf_mc_06", type: "mc", topic: "perfect",
    instruction: "空所に最も適切なものを選びなさい。",
    question: "The concert ___ finished by three.",
    choices: ["will", "will have", "has", "was"],
    answer: "will have",
    explanation: "未来完了 will have＋過去分詞「〜してしまっているだろう」。by three「3時までには」。",
    translation: "3時までには、コンサートは終わってしまっているだろう。" },

  // --- 穴埋め ---
  { id: "pf_fl_01", type: "fill", topic: "perfect",
    instruction: "( )内の語を適切な形にして空所を埋めなさい。",
    question: "Henry has just ___ his homework. (finish)",
    answer: "finished",
    explanation: "現在完了の完了用法 have/has＋過去分詞。finish の過去分詞は finished。",
    translation: "ヘンリーはちょうど宿題をやり終えたところだ。" },

  { id: "pf_fl_02", type: "fill", topic: "perfect",
    instruction: "「行ったことがある（経験）」の意味になるよう ( )の語を適切な形にしなさい。",
    question: "I have ___ to Thailand. (be)",
    answer: "been",
    explanation: "have been to「〜へ行ったことがある（経験）」。have gone to だと「行ってしまった（今いない）」になる。",
    translation: "私はタイに行ったことがある。" },

  { id: "pf_fl_03", type: "fill", topic: "perfect",
    instruction: "期間の長さを尋ねる文になるよう、空所に1語入れなさい。",
    question: "___ long have you lived here?",
    answer: "How",
    explanation: "How long ...?「どのくらいの間…？」期間を尋ねる継続用法の表現。",
    translation: "どのくらいの間ここに住んでいますか。" },

  { id: "pf_fl_04", type: "fill", topic: "perfect",
    instruction: "( )内の語を適切な形にしなさい（過去完了進行形）。",
    question: "I had been ___ for two hours when I found the gas station. (drive)",
    answer: "driving",
    explanation: "過去完了進行形 had been＋-ing。過去のある時点までの動作の継続を表す。",
    translation: "ガソリンスタンドを見つけた時、私は2時間ずっと運転していた。" },

  { id: "pf_fl_05", type: "fill", topic: "perfect",
    instruction: "( )内の語を適切な形にしなさい（未来完了）。",
    question: "Next month we will have ___ married for twenty years. (be)",
    answer: "been",
    explanation: "未来完了 will have＋過去分詞。be の過去分詞は been。状態の継続を表す。",
    translation: "来月で私たちは結婚して20年になります。" },

  // --- 並び替え ---
  { id: "pf_ro_01", type: "reorder", topic: "perfect",
    instruction: "( )内の語を並べ替えて意味の通る英文にしなさい。",
    question: "( already / I / spent / have ) all my money.",
    tokens: ["already", "I", "spent", "have"],
    answer: "I have already spent",
    explanation: "現在完了は〈have＋過去分詞〉。副詞 already は have と過去分詞の間に置く。",
    translation: "私はもうお金を全部使ってしまった。" },

  { id: "pf_ro_02", type: "reorder", topic: "perfect",
    instruction: "( )内の語を並べ替えて意味の通る英文にしなさい。",
    question: "( ever / you / climbed / Have ) Mt. Fuji?",
    tokens: ["ever", "you", "climbed", "Have"],
    answer: "Have you ever climbed",
    explanation: "経験を問う現在完了の疑問文〈Have＋主語＋(ever)＋過去分詞〉。",
    translation: "今までに富士山に登ったことがありますか。" },

  { id: "pf_ro_03", type: "reorder", topic: "perfect",
    instruction: "( )内の語を並べ替えて意味の通る英文にしなさい。",
    question: "( known / They / had / each other ) for ten years when they got married.",
    tokens: ["known", "They", "had", "each other"],
    answer: "They had known each other",
    explanation: "過去完了の継続〈had＋過去分詞〉。結婚した過去の時点まで10年間続いていた。",
    translation: "彼らが結婚した時、知り合ってから10年になっていた。" },

  { id: "pf_ro_04", type: "reorder", topic: "perfect",
    instruction: "( )内の語を並べ替えて意味の通る英文にしなさい。",
    question: "I realized that ( left / I / had / my umbrella ) in his car.",
    tokens: ["left", "I", "had", "my umbrella"],
    answer: "I had left my umbrella",
    explanation: "大過去。realized（過去）より前に置き忘れた事柄を過去完了で表す。",
    translation: "私は彼の車の中にかさを置き忘れたことに気づいた。" },

  { id: "pf_ro_05", type: "reorder", topic: "perfect",
    instruction: "( )内の語を並べ替えて意味の通る英文にしなさい。",
    question: "( seen / I / will / have ) the musical three times if I see it again.",
    tokens: ["seen", "I", "will", "have"],
    answer: "I will have seen",
    explanation: "未来完了〈will have＋過去分詞〉。「もう1回見たら3回見たことになる」という未来の時点での経験。",
    translation: "もう1回見たら、私はそのミュージカルを3回見たことになる。" },

  // --- 英作文 ---
  { id: "pf_wr_01", type: "writing", topic: "perfect",
    instruction: "次の日本語を英語にしなさい。",
    question: "私は2度ロンドンを訪れたことがある。",
    answer: "I have visited London twice.",
    explanation: "経験用法〈have＋過去分詞〉＋回数 twice。",
    translation: "I have visited London twice." },

  { id: "pf_wr_02", type: "writing", topic: "perfect",
    instruction: "次の日本語を英語にしなさい。",
    question: "彼らが結婚した時、知り合ってから10年になっていた。",
    answer: "They had known each other for ten years when they got married.",
    explanation: "過去完了の継続。基準は過去（got married）。for ten years で期間を示す。",
    translation: "They had known each other for ten years when they got married." },

  { id: "pf_wr_03", type: "writing", topic: "perfect",
    instruction: "次の日本語を英語にしなさい。",
    question: "来月で私たちは結婚して20年になります。",
    answer: "Next month we will have been married for twenty years.",
    explanation: "未来完了。未来のある時点までの状態の継続を will have been で表す。",
    translation: "Next month we will have been married for twenty years." },

  // --- 正誤 ---
  { id: "pf_er_01", type: "error", topic: "perfect",
    instruction: "誤りを含む英文です。正しい文に直しなさい。",
    question: "I have lost my key yesterday.",
    answer: "I lost my key yesterday.",
    accept: ["I lost my key yesterday"],
    explanation: "yesterday は過去の一点を表すので現在完了とは併用できない。過去形 lost にする（または yesterday を削る）。",
    translation: "私は昨日かぎをなくした。" },

  { id: "pf_er_02", type: "error", topic: "perfect",
    instruction: "誤りを含む英文です。正しい文に直しなさい。",
    question: "He has gone to Thailand three times.",
    answer: "He has been to Thailand three times.",
    accept: ["He has been to Thailand three times"],
    explanation: "have gone to は「行ってしまった（今いない）」で回数（経験）には使えない。経験は have been to。",
    translation: "彼はタイに3回行ったことがある。" },

  { id: "pf_er_03", type: "error", topic: "perfect",
    instruction: "「ずっと勉強している（継続）」の意味になるよう、誤りを直しなさい。",
    question: "How long are you studying English?",
    answer: "How long have you been studying English?",
    accept: ["How long have you studied English?", "How long have you been studying English"],
    explanation: "状態・動作の継続は現在完了（進行形）で表す。How long have you been -ing? が自然。",
    translation: "どのくらいの間、英語を勉強していますか。" },

  // --- 英会話穴埋め ---
  { id: "pf_dl_01", type: "dialogue", topic: "perfect",
    instruction: "会話が成り立つよう、空所①②に同じ1語を入れなさい。",
    question: "A: Have you finished your report ①___?\nB: Not ②___. I need one more hour.",
    answer: "yet / yet",
    explanation: "疑問文の yet は「もう」、否定（Not yet）の yet は「まだ」。どちらも yet。",
    translation: "A: レポートはもう終わった？ B: まだだよ。あと1時間必要。" },

  { id: "pf_dl_02", type: "dialogue", topic: "perfect",
    instruction: "会話が成り立つよう、空所①②に適切な語を入れなさい。",
    question: "A: Have you ①___ been to Hokkaido?\nB: Yes, I've been there ②___.",
    answer: "ever / once",
    accept: ["ever / twice", "ever / before"],
    explanation: "①経験を問う ever「今までに」。②回数を表す once「1回」など（twice / before なども可）。",
    translation: "A: 北海道に行ったことある？ B: うん、1回行ったことがあるよ。" },

  // --- 選択問題 ---
  { id: "pf_ch_01", type: "choice", topic: "perfect",
    instruction: "正しい方を選びなさい。",
    question: "I have lived here ( for / since ) ten years.",
    choices: ["for", "since"],
    answer: "for",
    explanation: "ten years は期間なので for＋期間「〜の間」。since は時の一点に使う。",
    translation: "私はここに10年間住んでいる。" },

  { id: "pf_ch_02", type: "choice", topic: "perfect",
    instruction: "正しい方を選びなさい。",
    question: "He has ( been / gone ) to the station, so he isn't here now.",
    choices: ["been", "gone"],
    answer: "gone",
    explanation: "「今ここにいない」=結果の意味。have gone to「〜へ行ってしまった」。",
    translation: "彼は駅へ行ってしまったので、今ここにいない。" },

  { id: "pf_ch_03", type: "choice", topic: "perfect",
    instruction: "正しい方を選びなさい。",
    question: "The movie ( started / has started ) ten minutes ago.",
    choices: ["started", "has started"],
    answer: "started",
    explanation: "ago は過去の一点を表すので現在完了は不可。過去形 started を使う。",
    translation: "その映画は10分前に始まった。" },

  // ============================================================
  // 助動詞 (modal)
  // ============================================================

  // --- 4択 ---
  { id: "md_mc_01", type: "mc", topic: "modal",
    instruction: "空所に最も適切なものを選びなさい。",
    question: "___ I use your bathroom?",
    choices: ["Must", "Shall", "May", "Will"],
    answer: "May",
    explanation: "許可を求める May I ...?「〜してもよろしいですか」。",
    translation: "トイレをお借りしてもよろしいですか。" },

  { id: "md_mc_02", type: "mc", topic: "modal",
    instruction: "空所に最も適切なものを選びなさい。",
    question: "You ___ attend the meeting.",
    choices: ["must", "may", "can", "need"],
    answer: "must",
    explanation: "義務・必要「〜しなければならない」。= have to。",
    translation: "あなたはその会合に出席しなければならない。" },

  { id: "md_mc_03", type: "mc", topic: "modal",
    instruction: "「その必要はない（不必要）」の意味になるものを選びなさい。",
    question: "You ___ start at once. It isn't necessary.",
    choices: ["must not", "don't have to", "can't", "shouldn't"],
    answer: "don't have to",
    explanation: "don't have to「〜する必要はない」（不必要）。must not は「〜してはいけない」（禁止）。",
    translation: "すぐに出発する必要はない。" },

  { id: "md_mc_04", type: "mc", topic: "modal",
    instruction: "「〜に違いない（確信）」の意味になるものを選びなさい。",
    question: "She ___ be Bobby's sister. They look so alike.",
    choices: ["must", "can't", "may", "will"],
    answer: "must",
    explanation: "確信を表す must「〜に違いない」。",
    translation: "彼女はボビーのお姉さんに違いない。" },

  { id: "md_mc_05", type: "mc", topic: "modal",
    instruction: "「〜のはずがない」の意味になるものを選びなさい。",
    question: "Karen ___ be home now; she's still at the office.",
    choices: ["must", "can't", "should", "may"],
    answer: "can't",
    explanation: "否定の確信 can't[cannot]「〜のはずがない」。",
    translation: "カレンが今、家にいるはずはない。" },

  { id: "md_mc_06", type: "mc", topic: "modal",
    instruction: "「〜したに違いない」の意味になるものを選びなさい。",
    question: "He ___ have told me a lie.",
    choices: ["may", "should", "must", "cannot"],
    answer: "must",
    explanation: "must have＋過去分詞「〜したに違いない」（過去の確信）。",
    translation: "彼は私にうそを言ったに違いない。" },

  // --- 穴埋め ---
  { id: "md_fl_01", type: "fill", topic: "modal",
    instruction: "「すぐ泳げるようになる（未来の可能）」の意味になるよう、空所に3語入れなさい。",
    question: "You will ___ ___ ___ swim soon.",
    answer: "be able to",
    explanation: "未来の可能は will be able to で表す（will can は不可）。",
    translation: "あなたはすぐに泳げるようになるでしょう。" },

  { id: "md_fl_02", type: "fill", topic: "modal",
    instruction: "「以前は〜があった（今はない）」の意味になるよう、空所に2語入れなさい。",
    question: "There ___ ___ be a post office on this corner.",
    answer: "used to",
    explanation: "used to＋動詞の原形「（今はそうでないが）以前は〜だった」。状態動詞 be とも結びつく。",
    translation: "以前、この角に郵便局があった（が今はない）。" },

  { id: "md_fl_03", type: "fill", topic: "modal",
    instruction: "「7時に起きるべきだったのに」の意味になるよう、空所に2語入れなさい。",
    question: "You ___ ___ got up at seven.",
    answer: "should have",
    explanation: "should[ought to] have＋過去分詞「〜すべきだったのに（実際はしなかった）」。",
    translation: "あなたは7時に起きるべきだったのに。" },

  { id: "md_fl_04", type: "fill", topic: "modal",
    instruction: "「お茶をいれましょうか（申し出）」の意味になるよう、空所に1語入れなさい。",
    question: "___ I make some tea?",
    answer: "Shall",
    explanation: "Shall I ...?「（私が）…しましょうか」相手への申し出。",
    translation: "お茶をいれましょうか。" },

  { id: "md_fl_05", type: "fill", topic: "modal",
    instruction: "「入りたいのですが（ていねいな希望）」の意味になるよう、空所に2語入れなさい。",
    question: "I'd ___ ___ join your team.",
    answer: "like to",
    explanation: "would like to ...「…したいと思うのですが」ていねいな申し出・希望。",
    translation: "あなたたちのチームに入りたいのですが。" },

  // --- 並び替え ---
  { id: "md_ro_01", type: "reorder", topic: "modal",
    instruction: "( )内の語を並べ替えて意味の通る英文にしなさい。",
    question: "( make / Anybody / mistakes / can ).",
    tokens: ["make", "Anybody", "mistakes", "can"],
    answer: "Anybody can make mistakes",
    explanation: "can「〜はありうる」（可能性）。〈助動詞＋動詞の原形〉。",
    translation: "だれにだって間違いはありうる。" },

  { id: "md_ro_02", type: "reorder", topic: "modal",
    instruction: "( )内の語を並べ替えて意味の通る英文にしなさい。",
    question: "( be / He / can't / home ) now.",
    tokens: ["be", "He", "can't", "home"],
    answer: "He can't be home",
    explanation: "can't be「〜のはずがない」。助動詞の後は原形 be。",
    translation: "彼が今、家にいるはずはない。" },

  { id: "md_ro_03", type: "reorder", topic: "modal",
    instruction: "( )内の語を並べ替えて意味の通る英文にしなさい。",
    question: "( you / Will / close / the window )?",
    tokens: ["you", "Will", "close", "the window"],
    answer: "Will you close the window",
    explanation: "Will you ...?「〜してくれませんか」依頼を表す。",
    translation: "窓を閉めてくれませんか。" },

  { id: "md_ro_04", type: "reorder", topic: "modal",
    instruction: "( )内の語を並べ替えて意味の通る英文にしなさい。",
    question: "( have / must / He / told ) me a lie.",
    tokens: ["have", "must", "He", "told"],
    answer: "He must have told",
    explanation: "must have＋過去分詞「〜したに違いない」。語順は〈主語＋must＋have＋過去分詞〉。",
    translation: "彼は私にうそを言ったに違いない。" },

  { id: "md_ro_05", type: "reorder", topic: "modal",
    instruction: "( )内の語を並べ替えて意味の通る英文にしなさい。",
    question: "( rather / I'd / stay / home ).",
    tokens: ["rather", "I'd", "stay", "home"],
    answer: "I'd rather stay home",
    explanation: "would rather＋原形「（〜するより）むしろ…したい」。",
    translation: "私は家にいたいのです。" },

  // --- 英作文 ---
  { id: "md_wr_01", type: "writing", topic: "modal",
    instruction: "次の日本語を英語にしなさい。",
    question: "あなたはその会合に出席しなければならない。",
    answer: "You must attend the meeting.",
    accept: ["You have to attend the meeting."],
    explanation: "義務「〜しなければならない」= must / have to。",
    translation: "You must attend the meeting." },

  { id: "md_wr_02", type: "writing", topic: "modal",
    instruction: "次の日本語を英語にしなさい。",
    question: "お茶をいれましょうか。",
    answer: "Shall I make some tea?",
    explanation: "申し出 Shall I ...?「…しましょうか」。",
    translation: "Shall I make some tea?" },

  { id: "md_wr_03", type: "writing", topic: "modal",
    instruction: "次の日本語を英語にしなさい。",
    question: "彼は私にうそを言ったに違いない。",
    answer: "He must have told me a lie.",
    explanation: "過去の確信 must have＋過去分詞。",
    translation: "He must have told me a lie." },

  // --- 正誤 ---
  { id: "md_er_01", type: "error", topic: "modal",
    instruction: "誤りを含む英文です。正しい文に直しなさい。",
    question: "You must to attend the meeting.",
    answer: "You must attend the meeting.",
    accept: ["You must attend the meeting"],
    explanation: "助動詞 must の後ろは動詞の原形（to は不要）。",
    translation: "あなたはその会合に出席しなければならない。" },

  { id: "md_er_02", type: "error", topic: "modal",
    instruction: "誤りを含む英文です。正しい文に直しなさい。",
    question: "He may has heard this joke before.",
    answer: "He may have heard this joke before.",
    accept: ["He may have heard this joke before"],
    explanation: "助動詞の後は have（原形）。〈may have＋過去分詞〉「〜したかもしれない」。",
    translation: "この冗談は前に聞いたことがあるかもしれませんね。" },

  { id: "md_er_03", type: "error", topic: "modal",
    instruction: "「昨日勉強しなければならなかった（過去の義務）」の意味になるよう直しなさい。",
    question: "I must study hard yesterday.",
    answer: "I had to study hard yesterday.",
    accept: ["I had to study hard yesterday"],
    explanation: "must は現在時制でしか使えない。過去は had to で表す。",
    translation: "私は昨日、一生懸命勉強しなければならなかった。" },

  // --- 英会話穴埋め ---
  { id: "md_dl_01", type: "dialogue", topic: "modal",
    instruction: "会話が成り立つよう、空所①に1語入れなさい。",
    question: "A: ①___ I open the window?\nB: Yes, please. It's hot in here.",
    answer: "Shall",
    explanation: "Shall I ...?「（私が）…しましょうか」相手のための申し出。B の Yes, please. が応答として自然。",
    translation: "A: 窓を開けましょうか。 B: お願いします。暑いので。" },

  { id: "md_dl_02", type: "dialogue", topic: "modal",
    instruction: "会話が成り立つよう、空所①にていねいな依頼を表す1語を入れなさい。",
    question: "A: ①___ you pass me the salt?\nB: Sure, here you are.",
    answer: "Could",
    accept: ["Can", "Will", "Would"],
    explanation: "依頼の Can[Could] you ...? / Will[Would] you ...?。Could / Would はよりていねい。",
    translation: "A: 塩を取ってくれませんか。 B: いいですよ、はい。" },

  // --- 選択問題 ---
  { id: "md_ch_01", type: "choice", topic: "modal",
    instruction: "正しい方を選びなさい。",
    question: "You ( must not / don't have to ) hurry; we have plenty of time.",
    choices: ["must not", "don't have to"],
    answer: "don't have to",
    explanation: "「時間は十分ある」→「急ぐ必要はない（不必要）」= don't have to。must not は禁止。",
    translation: "急ぐ必要はない。時間は十分ある。" },

  { id: "md_ch_02", type: "choice", topic: "modal",
    instruction: "正しい方を選びなさい。",
    question: "( May / Must ) I come in? — Sure.",
    choices: ["May", "Must"],
    answer: "May",
    explanation: "許可を求める May I ...?「入ってもよろしいですか」。",
    translation: "入ってもよろしいですか。― どうぞ。" },

  { id: "md_ch_03", type: "choice", topic: "modal",
    instruction: "正しい方を選びなさい。",
    question: "He ( used to / is used to ) live in Tokyo, but now he lives in Osaka.",
    choices: ["used to", "is used to"],
    answer: "used to",
    explanation: "used to＋原形「以前は〜していた」。is used to＋名詞/動名詞は「〜に慣れている」で意味が異なる。",
    translation: "彼は以前は東京に住んでいたが、今は大阪に住んでいる。" },

  // ============================================================
  // 態（受動態） (passive)
  // ============================================================

  // --- 4択 ---
  { id: "pv_mc_01", type: "mc", topic: "passive",
    instruction: "空所に最も適切なものを選びなさい。",
    question: "This temple ___ about 500 years ago.",
    choices: ["built", "was built", "has built", "was building"],
    answer: "was built",
    explanation: "受動態の過去〈be動詞の過去＋過去分詞〉。「建てられた」。",
    translation: "この寺は約500年前に建てられた。" },

  { id: "pv_mc_02", type: "mc", topic: "passive",
    instruction: "空所に最も適切なものを選びなさい。",
    question: "The book ___ from the library.",
    choices: ["can borrow", "can be borrowed", "can borrowed", "borrows"],
    answer: "can be borrowed",
    explanation: "助動詞を使った受動態〈助動詞＋be＋過去分詞〉。",
    translation: "その本は図書館から借りることができる。" },

  { id: "pv_mc_03", type: "mc", topic: "passive",
    instruction: "空所に最も適切なものを選びなさい。",
    question: "The stadium ___ now.",
    choices: ["is building", "is being built", "is built", "builds"],
    answer: "is being built",
    explanation: "進行形の受動態〈be動詞＋being＋過去分詞〉「〜されている最中だ」。",
    translation: "その競技場は現在建設中です。" },

  { id: "pv_mc_04", type: "mc", topic: "passive",
    instruction: "空所に最も適切なものを選びなさい。",
    question: "This song ___ by a lot of singers.",
    choices: ["has sung", "has been sung", "sang", "singing"],
    answer: "has been sung",
    explanation: "完了形の受動態〈have/has been＋過去分詞〉「歌われてきた」。",
    translation: "この歌はたくさんの歌手によって歌われてきた。" },

  { id: "pv_mc_05", type: "mc", topic: "passive",
    instruction: "空所に最も適切なものを選びなさい。",
    question: "The top of the mountain is covered ___ snow.",
    choices: ["by", "with", "of", "at"],
    answer: "with",
    explanation: "be covered with ...「…で覆われている」。前置詞に注意。",
    translation: "その山の頂上は雪で覆われている。" },

  { id: "pv_mc_06", type: "mc", topic: "passive",
    instruction: "空所に最も適切なものを選びなさい。",
    question: "She was shocked ___ the news.",
    choices: ["of", "at", "with", "for"],
    answer: "at",
    explanation: "be shocked at ...「…にショックを受ける」。感情を表す受動態の前置詞。",
    translation: "彼女はその知らせにショックを受けた。" },

  // --- 穴埋め ---
  { id: "pv_fl_01", type: "fill", topic: "passive",
    instruction: "( )内の語を適切な形にしなさい。",
    question: "This car was ___ by my brother. (repair)",
    answer: "repaired",
    explanation: "受動態〈be＋過去分詞〉。repair の過去分詞は repaired。",
    translation: "この車は私の兄によって修理された。" },

  { id: "pv_fl_02", type: "fill", topic: "passive",
    instruction: "「世話をされた」の意味になるよう、空所に2語入れなさい（群動詞の受動態）。",
    question: "The cat was taken ___ ___ by my sister.",
    answer: "care of",
    explanation: "take care of を1つの動詞とみなして受動態に。be taken care of by ...。",
    translation: "そのネコは私の姉に世話をされた。" },

  { id: "pv_fl_03", type: "fill", topic: "passive",
    instruction: "( )内の語を適切な形にしなさい（give型の受動態）。",
    question: "Jim was ___ a Christmas card by Mary. (send)",
    answer: "sent",
    explanation: "give型動詞は「相手」を主語にできる。was sent ＋〈物〉。send の過去分詞は sent。",
    translation: "ジムはメアリーからクリスマスカードを送られた。" },

  { id: "pv_fl_04", type: "fill", topic: "passive",
    instruction: "( )内の語を適切な形にしなさい（補語をとる受動態）。",
    question: "The baby was ___ Carl by his grandfather. (name)",
    answer: "named",
    explanation: "name A B「AをBと名づける」の受動態。〈be＋過去分詞〉の後に補語 Carl を続ける。",
    translation: "その赤ちゃんは祖父によってカールと名づけられた。" },

  { id: "pv_fl_05", type: "fill", topic: "passive",
    instruction: "「〜と結婚している」の意味になるよう、空所に1語入れなさい。",
    question: "Helen is married ___ an artist.",
    answer: "to",
    explanation: "be married to ...「…と結婚している」。前置詞は to。",
    translation: "ヘレンは芸術家と結婚している。" },

  // --- 並び替え ---
  { id: "pv_ro_01", type: "reorder", topic: "passive",
    instruction: "( )内の語を並べ替えて意味の通る英文にしなさい。",
    question: "( built / This temple / was ) about 500 years ago.",
    tokens: ["built", "This temple", "was"],
    answer: "This temple was built",
    explanation: "受動態〈主語＋be＋過去分詞〉。",
    translation: "この寺は約500年前に建てられた。" },

  { id: "pv_ro_02", type: "reorder", topic: "passive",
    instruction: "( )内の語を並べ替えて意味の通る英文にしなさい。",
    question: "( be / can / borrowed / The book ) from the library.",
    tokens: ["be", "can", "borrowed", "The book"],
    answer: "The book can be borrowed",
    explanation: "助動詞を使った受動態〈助動詞＋be＋過去分詞〉。",
    translation: "その本は図書館から借りることができる。" },

  { id: "pv_ro_03", type: "reorder", topic: "passive",
    instruction: "( )内の語を並べ替えて意味の通る英文にしなさい。",
    question: "( being / The stadium / is / built ) now.",
    tokens: ["being", "The stadium", "is", "built"],
    answer: "The stadium is being built",
    explanation: "進行形の受動態〈be＋being＋過去分詞〉。",
    translation: "その競技場は現在建設中です。" },

  { id: "pv_ro_04", type: "reorder", topic: "passive",
    instruction: "( )内の語を並べ替えて意味の通る英文にしなさい。",
    question: "( was / The cat / taken care of ) by my sister.",
    tokens: ["was", "The cat", "taken care of"],
    answer: "The cat was taken care of",
    explanation: "群動詞 take care of を1語とみなして受動態にする。",
    translation: "そのネコは私の姉に世話をされた。" },

  { id: "pv_ro_05", type: "reorder", topic: "passive",
    instruction: "( )内の語を並べ替えて意味の通る英文（疑問文）にしなさい。",
    question: "( invited / Who / to the party / was )?",
    tokens: ["invited", "Who", "to the party", "was"],
    answer: "Who was invited to the party",
    explanation: "疑問詞が主語になる受動態〈疑問詞＋be＋過去分詞 …?〉。",
    translation: "だれがそのパーティーに招待されましたか。" },

  // --- 英作文 ---
  { id: "pv_wr_01", type: "writing", topic: "passive",
    instruction: "次の日本語を英語にしなさい。",
    question: "この寺は約500年前に建てられた。",
    answer: "This temple was built about 500 years ago.",
    explanation: "受動態の過去〈was/were＋過去分詞〉。",
    translation: "This temple was built about 500 years ago." },

  { id: "pv_wr_02", type: "writing", topic: "passive",
    instruction: "次の日本語を英語にしなさい。",
    question: "その本は図書館から借りることができる。",
    answer: "The book can be borrowed from the library.",
    explanation: "助動詞を使った受動態〈助動詞＋be＋過去分詞〉。",
    translation: "The book can be borrowed from the library." },

  { id: "pv_wr_03", type: "writing", topic: "passive",
    instruction: "次の日本語を英語にしなさい。",
    question: "その山の頂上は雪で覆われている。",
    answer: "The top of the mountain is covered with snow.",
    explanation: "be covered with ...「…で覆われている」。",
    translation: "The top of the mountain is covered with snow." },

  // --- 正誤 ---
  { id: "pv_er_01", type: "error", topic: "passive",
    instruction: "誤りを含む英文です。正しい文に直しなさい。",
    question: "This bag made in Italy.",
    answer: "This bag was made in Italy.",
    accept: ["This bag was made in Italy"],
    explanation: "受動態には be動詞が必要。〈be＋過去分詞〉で was made。",
    translation: "このかばんはイタリアで作られた。" },

  { id: "pv_er_02", type: "error", topic: "passive",
    instruction: "誤りを含む英文です。正しい文に直しなさい。",
    question: "English is speak in many countries.",
    answer: "English is spoken in many countries.",
    accept: ["English is spoken in many countries"],
    explanation: "受動態は〈be＋過去分詞〉。原形 speak ではなく過去分詞 spoken。",
    translation: "英語は多くの国で話されている。" },

  { id: "pv_er_03", type: "error", topic: "passive",
    instruction: "誤りを含む英文です。正しい文に直しなさい。",
    question: "I was made a new dress by my mother.",
    answer: "A new dress was made for me by my mother.",
    accept: ["A new dress was made for me by my mother"],
    explanation: "make などのbuy型は「相手（I）」を主語にできない。物を主語にし for me を続ける。",
    translation: "新しいドレスが母によって私に作られた。" },

  // --- 英会話穴埋め ---
  { id: "pv_dl_01", type: "dialogue", topic: "passive",
    instruction: "会話が成り立つよう、空所①②に同じ1語を入れなさい（受動態）。",
    question: "A: When ①___ this bridge built?\nB: It ②___ built about 100 years ago.",
    answer: "was / was",
    explanation: "時を尋ねる受動態の疑問文〈疑問詞＋be＋主語＋過去分詞 …?〉と、その答え。どちらも was。",
    translation: "A: この橋はいつ造られたのですか。 B: 約100年前に造られました。" },

  { id: "pv_dl_02", type: "dialogue", topic: "passive",
    instruction: "会話が成り立つよう、空所①に1語入れなさい（助動詞を使った受動態の疑問文）。",
    question: "A: ①___ this door be painted tomorrow?\nB: Yes, it will.",
    answer: "Will",
    explanation: "助動詞を使った受動態の疑問文〈助動詞＋主語＋be＋過去分詞 …?〉。答えが Yes, it will. なので Will。",
    translation: "A: このドアは明日ペンキを塗られるのですか。 B: はい、塗られます。" },

  // --- 選択問題 ---
  { id: "pv_ch_01", type: "choice", topic: "passive",
    instruction: "正しい方を選びなさい。",
    question: "This car ( repaired / was repaired ) by my brother.",
    choices: ["repaired", "was repaired"],
    answer: "was repaired",
    explanation: "「修理された」=受動態〈be＋過去分詞〉。by ~ が「する側」。",
    translation: "この車は私の兄によって修理された。" },

  { id: "pv_ch_02", type: "choice", topic: "passive",
    instruction: "正しい方を選びなさい。",
    question: "The newspapers ( deliver / are delivered ) around 5 a.m.",
    choices: ["deliver", "are delivered"],
    answer: "are delivered",
    explanation: "新聞は「配達される」側なので受動態。する側が明らかで示す必要がない場合 by ~ を省く。",
    translation: "新聞は朝の5時ごろに配達されます。" },

  { id: "pv_ch_03", type: "choice", topic: "passive",
    instruction: "正しい方を選びなさい。",
    question: "William ( bore / was born ) in New York.",
    choices: ["bore", "was born"],
    answer: "was born",
    explanation: "be born「生まれる」は受動態の決まった表現。",
    translation: "ウィリアムはニューヨークで生まれた。" },

  // ============================================================
  // スペル書き（完了形・受動態で使う不規則動詞の過去分詞）
  // ============================================================
  { id: "sp_01", type: "spelling", topic: "perfect",
    instruction: "次の動詞の過去分詞をスペルで書きなさい。",
    question: "write（書く）",
    answer: "written",
    explanation: "write - wrote - written。完了形・受動態で使う。" },

  { id: "sp_02", type: "spelling", topic: "passive",
    instruction: "次の動詞の過去分詞をスペルで書きなさい。",
    question: "speak（話す）",
    answer: "spoken",
    explanation: "speak - spoke - spoken。is spoken など受動態で頻出。" },

  { id: "sp_03", type: "spelling", topic: "passive",
    instruction: "次の動詞の過去分詞をスペルで書きなさい。",
    question: "build（建てる）",
    answer: "built",
    explanation: "build - built - built。was built など受動態で頻出。" },

  { id: "sp_04", type: "spelling", topic: "perfect",
    instruction: "次の動詞の過去分詞をスペルで書きなさい。",
    question: "begin（始まる）",
    answer: "begun",
    explanation: "begin - began - begun。had already begun など完了形で頻出。" },

  { id: "sp_05", type: "spelling", topic: "perfect",
    instruction: "次の動詞の過去分詞をスペルで書きなさい。",
    question: "know（知っている）",
    answer: "known",
    explanation: "know - knew - known。had known など完了形で頻出。" },

  { id: "sp_06", type: "spelling", topic: "passive",
    instruction: "次の動詞の過去分詞をスペルで書きなさい。",
    question: "take（取る）",
    answer: "taken",
    explanation: "take - took - taken。was taken care of などで使う。" },

  { id: "sp_07", type: "spelling", topic: "passive",
    instruction: "次の動詞の過去分詞をスペルで書きなさい。",
    question: "give（与える）",
    answer: "given",
    explanation: "give - gave - given。受動態・完了形ともに頻出。" },

  { id: "sp_08", type: "spelling", topic: "passive",
    instruction: "次の動詞の過去分詞をスペルで書きなさい。",
    question: "sing（歌う）",
    answer: "sung",
    explanation: "sing - sang - sung。has been sung など完了受動態で頻出。" },

  { id: "sp_09", type: "spelling", topic: "passive",
    instruction: "次の動詞の過去分詞をスペルで書きなさい。",
    question: "break（壊す）",
    answer: "broken",
    explanation: "break - broke - broken。was broken など受動態で頻出。" },

  { id: "sp_10", type: "spelling", topic: "perfect",
    instruction: "次の動詞の過去分詞をスペルで書きなさい。",
    question: "find（見つける）",
    answer: "found",
    explanation: "find - found - found。was not found など受動態でも使う。" },

  // ============================================================
  // 予想問題（横断ミックス）predicted: true
  // ============================================================
  { id: "x_01", type: "mc", topic: "perfect", predicted: true,
    instruction: "【予想】空所に最も適切なものを選びなさい。",
    question: "I ___ to Canada twice.",
    choices: ["have been", "have gone", "went", "am going"],
    answer: "have been",
    explanation: "回数（経験）は have been to。have gone to は「行ってしまった（今いない）」で回数には不可。",
    translation: "私はカナダに2度行ったことがある。" },

  { id: "x_02", type: "fill", topic: "perfect", predicted: true,
    instruction: "【予想】( )内の語を適切な形にしなさい。",
    question: "She has been ___ English for three hours. (study)",
    answer: "studying",
    explanation: "現在完了進行形〈have/has been＋-ing〉。動作の継続を表す。",
    translation: "彼女は3時間ずっと英語を勉強している。" },

  { id: "x_03", type: "reorder", topic: "modal", predicted: true,
    instruction: "【予想】( )内の語を並べ替えて意味の通る英文にしなさい。",
    question: "( better / had / You / report ) the accident to the police.",
    tokens: ["better", "had", "You", "report"],
    answer: "You had better report",
    explanation: "had better＋原形「〜しなさい／〜したほうがいい」（忠告）。",
    translation: "その事故のことを警察に通報しなさい。" },

  { id: "x_04", type: "writing", topic: "modal", predicted: true,
    instruction: "【予想】次の日本語を英語にしなさい。",
    question: "あなたは毎日運動すべきです。",
    answer: "You should exercise every day.",
    accept: ["You ought to exercise every day."],
    explanation: "義務・当然 should[ought to]「〜すべきだ」。",
    translation: "You should exercise every day." },

  { id: "x_05", type: "error", topic: "passive", predicted: true,
    instruction: "【予想】誤りを含む英文です。正しい文に直しなさい。",
    question: "The window was broke by the boys.",
    answer: "The window was broken by the boys.",
    accept: ["The window was broken by the boys"],
    explanation: "受動態は〈be＋過去分詞〉。break の過去分詞は broken（broke は過去形）。",
    translation: "その窓は少年たちによって割られた。" },

  { id: "x_06", type: "choice", topic: "perfect", predicted: true,
    instruction: "【予想】正しい方を選びなさい。",
    question: "I have known him ( for / since ) I was a child.",
    choices: ["for", "since"],
    answer: "since",
    explanation: "since I was a child「子どもだった時以来」。since＋〈主語＋動詞〉も時の起点を表す。",
    translation: "私は子どものころから彼を知っている。" },

  { id: "x_07", type: "mc", topic: "passive", predicted: true,
    instruction: "【予想】空所に最も適切なものを選びなさい。",
    question: "A lot of stars ___ in the sky last night.",
    choices: ["saw", "were seen", "are seen", "seeing"],
    answer: "were seen",
    explanation: "星は「見られる」側なので受動態。last night（過去）に合わせ were seen。",
    translation: "昨夜は空にたくさんの星が見えた。" },

  { id: "x_08", type: "fill", topic: "modal", predicted: true,
    instruction: "【予想】「受け入れたはずがない」の意味になるよう、空所に2語入れなさい。",
    question: "He ___ ___ accepted your plan.",
    answer: "cannot have",
    accept: ["can't have", "could not have"],
    explanation: "cannot have＋過去分詞「〜したはずがない」（過去の否定の確信）。",
    translation: "彼があなたの計画を受け入れたはずがない。" },

  { id: "x_09", type: "dialogue", topic: "modal", predicted: true,
    instruction: "【予想】会話が成り立つよう、空所①に1語入れなさい（提案）。",
    question: "A: ①___ we go out for dinner tonight?\nB: Sounds good!",
    answer: "Shall",
    explanation: "Shall we ...?「…しましょうよ」提案（= Let's）。B の Sounds good! が応答として自然。",
    translation: "A: 今夜は外で夕食にしましょうよ。 B: いいね！" },

  { id: "x_10", type: "reorder", topic: "passive", predicted: true,
    instruction: "【予想】( )内の語を並べ替えて意味の通る英文にしなさい。",
    question: "( is / This song / loved / by ) young people.",
    tokens: ["is", "This song", "loved", "by"],
    answer: "This song is loved by",
    explanation: "受動態〈be＋過去分詞〉＋by〜「〜に愛されている」。",
    translation: "この歌は若者に愛されている。" },

  { id: "x_11", type: "writing", topic: "perfect", predicted: true,
    instruction: "【予想】次の日本語を英語にしなさい。",
    question: "私たちが競技場に着いた時、すでに試合は始まっていた。",
    answer: "The game had already begun when we arrived at the stadium.",
    explanation: "過去完了。基準の過去（arrived）より前の完了を had already begun で表す。",
    translation: "The game had already begun when we arrived at the stadium." },

  { id: "x_12", type: "mc", topic: "modal", predicted: true,
    instruction: "【予想】空所に最も適切なものを選びなさい。",
    question: "You ___ have got up earlier; you missed the train.",
    choices: ["should", "must", "may", "cannot"],
    answer: "should",
    explanation: "should have＋過去分詞「〜すべきだったのに（実際はしなかった）」。乗り遅れた後悔の文脈。",
    translation: "もっと早く起きるべきだったのに。電車に乗り遅れたよ。" },

  { id: "x_13", type: "error", topic: "perfect", predicted: true,
    instruction: "【予想】誤りを含む英文です。正しい文に直しなさい。",
    question: "I have finished my homework two hours ago.",
    answer: "I finished my homework two hours ago.",
    accept: ["I finished my homework two hours ago"],
    explanation: "ago は過去の一点を表すので現在完了は不可。過去形 finished にする。",
    translation: "私は2時間前に宿題を終えた。" },

  { id: "x_14", type: "spelling", topic: "passive", predicted: true,
    instruction: "【予想】( )内の動詞の過去分詞をスペルで書きなさい。",
    question: "The letter was ___ by Mary. (write)",
    answer: "written",
    explanation: "write の過去分詞は written。受動態〈be＋過去分詞〉。",
    translation: "その手紙はメアリーによって書かれた。" },

  { id: "x_15", type: "choice", topic: "passive", predicted: true,
    instruction: "【予想】正しい方を選びなさい。",
    question: "These photos ( took / were taken ) in Okinawa.",
    choices: ["took", "were taken"],
    answer: "were taken",
    explanation: "写真は「撮られる」側なので受動態。take の過去分詞 taken を用いる。",
    translation: "これらの写真は沖縄で撮られた。" },
];
