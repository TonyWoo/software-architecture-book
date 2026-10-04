// 反例：ReadOnlyFile 谎称自己是 File，write 时抛异常。
class File {
    String read() { return ""; }
    void write(String data) { }
}

class ReadOnlyFile extends File {
    @Override void write(String data) {
        throw new UnsupportedOperationException("只读文件不能写");
    }
}

// 正例：拆成两个接口，类按需实现，契约诚实。
interface Readable { String read(); }
interface Writable { void write(String data); }

class ReadOnlyFile2 implements Readable {
    public String read() { return ""; }
}

class ReadWriteFile implements Readable, Writable {
    public String read() { return ""; }
    public void write(String data) { }
}
