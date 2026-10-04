// 反例：胖接口逼着 Robot 实现"吃午饭"。
public interface IWorker
{
    void Work();
    void Eat();
}

public class Robot : IWorker
{
    public void Work() { }
    public void Eat() => throw new NotSupportedException("机器人不吃午饭");
}

// 正例：接口拆分，客户端只依赖它用的。
public interface IWorkable { void Work(); }
public interface IEatable { void Eat(); }

public class Human : IWorkable, IEatable
{
    public void Work() { }
    public void Eat() { }
}

public class Robot2 : IWorkable
{
    public void Work() { }
}
