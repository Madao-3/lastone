# Description:
#   Example scripts for you to examine and try out.
#
# Notes:
#   They are commented out by default, because most of them are pretty silly and
#   wouldn't be useful and amusing enough for day to day huboting.
#   Uncomment the ones you want to try and experiment with.
#
#   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md

module.exports = (robot) ->

  robot.hear /help/i, (res) ->
    res.send """
      欢迎来到最后一人：
        最后一人是一个文本游戏/考卷引导平台
        你可以通过 lastone.madao.me [暂未开放]
        
    """

  robot.respond /foo/i, (res) ->
    res.send 'bar'
