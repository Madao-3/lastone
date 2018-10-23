const Story = require("inkjs").Story;
const fs = require("fs");

const INK = function(userId, storyName, currentState) {
  return {
    userId,
    storyName,
    currentState,
    inkStory() {
      if (this.story) return this.story;
      const json = fs
        .readFileSync(`./stories/${this.storyName}.json`, "UTF-8")
        .replace(/^\uFEFF/, "");
      this.story = new Story(json);
      if (currentState) {
        this.story.state.LoadJson(currentState);
        this.currentState = null;
      }
      return this.story;
    },
    makeChoice(index, callback) {
      let inkStory = this.inkStory();
      inkStory.ContinueMaximally();
      if (!inkStory.currentChoices.length) {
        return {
          text: "游戏结束",
          attachments: [
            {
              color: "#9c0001",
              text: "游戏已结束，请输入【重新开始】重新开始游戏"
            }
          ]
        };
      }
      if (index < 0 || index >= inkStory.currentChoices.length) {
        return {
          text: "错误",
          attachments: [
            { color: "#9c0001", text: "回复的序号是错误的，请确定在边界内" }
          ]
        };
      }
      inkStory.ChooseChoiceIndex(index);
      callback && callback(inkStory.state);
      return this.formattedPathContent();
    },
    getPathContent(pathName) {
      let inkStory = this.inkStory();
      let currentState = this.currentState;
      if (pathName) {
        inkStory.ChoosePathString(pathName);
      }
      return {
        content: inkStory.ContinueMaximally(),
        choices: inkStory.currentChoices.map(function(choice) {
          return { text: choice.text, index: choice.index };
        })
      };
    },
    formattedPathContent(pathName) {
      let data = this.getPathContent(pathName);
      let attachments = data.content.split("\n").map(line => {
        return {
          color: "#999",
          text: line
        };
      });
      if (data.choices.length) {
        attachments.push({
          color: "#28a745",
          text: "回复一下序号继续游戏："
        });
        attachments = attachments.concat(
          data.choices.map(function(choice) {
            return {
              color: "#0077cc",
              text: `${choice.index + 1}. ${choice.text}`
            };
          })
        );
      } else {
        attachments.push({
          color: "#28a745",
          text: "[游戏结束]"
        });
      }
      return {
        text: "游戏正文",
        attachments
      };
    }
  };
};
module.exports = INK;
