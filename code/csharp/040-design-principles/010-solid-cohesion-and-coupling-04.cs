// 反例：ReadOnlyFile 谎称自己是 File，Write 时抛异常。
public class File
{
    public virtual string Read() => "";
    public virtual void Write(string data) { }
}

public class ReadOnlyFile : File
{
    public override void Write(string data)
        => throw new NotSupportedException("只读文件不能写");
}

// 正例：拆成两个接口，类按需实现，契约诚实。
public interface IReadable { string Read(); }
public interface IWritable { void Write(string data); }

public class ReadOnlyFile2 : IReadable
{
    public string Read() => "";
}

public class ReadWriteFile : IReadable, IWritable
{
    public string Read() => "";
    public void Write(string data) { }
}
