 //Example 5-14: The Bounds of a Circle
 //当光标位于圆的区域内时，其⼤⼩会减少/增加
 // 大逃杀：随机出现好圆圈呆到里面就会增加生命力，但好圆圈就会缩小
 // 随机也有坏圆圈会滞后追鼠标小球，鼠标小球被碰到会变小生命力缩减，坏圆圈扩大，坏圆圈默认会逐渐变小消失。
 // 好坏的判定可以用颜色情绪轮来找。
 var x = 120;
 var y = 60;
 var radius = 102;
 function setup() {
 createCanvas(240, 120);
 ellipseMode(RADIUS);
 }
 function draw() {
 background(204);
 var d = dist(mouseX, mouseY, x, y);
 if (d < radius) {
 radius=radius-0.1;
 fill(0);
 } else {
 fill(255);
 }
 ellipse(x, y, radius, radius);
 }