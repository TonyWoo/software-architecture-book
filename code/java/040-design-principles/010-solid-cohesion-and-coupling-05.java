// 反例：胖接口逼着 Robot 实现"吃午饭"。
interface Worker {
    void work();
    void eat();
}

class Robot implements Worker {
    public void work() { }
    public void eat() { throw new UnsupportedOperationException("机器人不吃午饭"); }
}

// 正例：接口拆分，客户端只依赖它用的。
interface Workable { void work(); }
interface Eatable { void eat(); }

class Human implements Workable, Eatable {
    public void work() { }
    public void eat() { }
}

class Robot2 implements Workable {
    public void work() { }
}
