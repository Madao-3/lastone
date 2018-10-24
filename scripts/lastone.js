const bearychat = require("bearychat");
const PORT = 6379;
const HOST = "127.0.0.1";
const redis = require("redis");
const client = redis.createClient(PORT, HOST);

const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);

const INK = require("./ink");

const token = "2caf981bab9106e6fccdfe6a5797120a";

const GAME_WHITE_LIST = /最后一人|科目一/;

module.exports = robot => {
  robot.hear(/[0-9]/, async res => {
    let msgContent = res.message.user.message.text;
    if (!/^[0-9]*$/.test(msgContent)) return;
    let userId = res.envelope.user.id;
    let storyName = await getCurrentStory(userId);
    let userState = await getState(storyStateKey(userId, storyName));
    let ink = INK(userId, storyName, userState);
    let choice = parseInt(msgContent.match(/^[0-9]*$/).toString(), 10) - 1;
    let responseData = ink.makeChoice(choice, function(state) {
      console.log("setState", state.toJson());
      setState(storyStateKey(userId, storyName), state);
    });
    responseData.message = res.message;
    robot.emit("bearychat.attachment", responseData);
  });

  robot.hear(GAME_WHITE_LIST, async res => {
    let userId = res.envelope.user.id;
    let msgContent = res.message.user.message.text;
    let storyName = msgContent.match(GAME_WHITE_LIST).toString();
    let userState = await getState(storyStateKey(userId, storyName));
    let ink = INK(userId, storyName, userState);
    client.set(`${userId}-playing`, storyName);
    console.log(userState);
    let responseData = ink.formattedPathContent();
    responseData.message = res.message;
    robot.emit("bearychat.attachment", responseData);
  });

  robot.hear(/选择/, async res => {
    let user = await getUserInfo(res.envelope.user.id);
    res.send(`${user.name} 你好，\n
    现阶段LastOne 只有一款游戏和一套Demo 试题，\n
    回复【最后一人】选择进入文字游戏《最后一人》的第一章 \n
    回复【科目一】可以尝试INK 实现的考卷引导系统`);
  });

  robot.hear(/重新开始|结束游戏/, async res => {
    let userId = res.envelope.user.id;
    clearAllState(userId);
    let user = await getUserInfo(userId);
    res.send(`${user.name} 你好，\n
    现阶段LastOne 只有一款游戏和一套Demo 试题，\n
    回复【最后一人】选择进入文字游戏《最后一人》的第一章 \n
    回复【科目一】可以尝试INK 实现的考卷引导系统`);
  });

  robot.hear(/help/i, function(res) {
    res.send(` 欢迎来到最后一人：\n
        最后一人是一个文本游戏/考卷引导平台 \n
        你可以通过 http://116.85.25.178/ 了解这个平台。\n
        回复【选择】进行游戏选择 \n
        回复【开始】继续最近一次的游戏 \n
        回复【重新开始】结束游戏进入游戏选择页面 \n
        回复【结束游戏】结束游戏`);
  });
};

let getUserInfo = async user_id => {
  let info = await getAsync(user_id);
  if (info && info.length) {
    info = JSON.parse(info);
  } else {
    info = await fetchFromRemote(user_id);
    info && client.set(user_id, JSON.stringify(info));
  }
  return info;
};

let fetchFromRemote = async user_id => {
  return (await bearychat.user.info({ token, user_id })).json();
};

let setState = async (key, state) => {
  client.set(key, state.toJson());
};

let getState = async key => {
  let stateContent = await getAsync(key);
  return stateContent;
};

let getCurrentStory = async userId => {
  return await getAsync(`${userId}-playing`);
};

let storyStateKey = (userId, storyName) => {
  return `${userId}-${storyName}-state`;
};
let clearAllState = userId => {
  client.keys(`${userId}-*`, (err, list) => {
    console.log("clear " + list.length);
    for (let key of list) {
      client.del(key);
    }
  });
};
