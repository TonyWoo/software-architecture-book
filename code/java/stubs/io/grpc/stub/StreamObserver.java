// 编译桩：仅用于验证示例语法，对应真实依赖 io.grpc:grpc-stub
package io.grpc.stub;

public interface StreamObserver<T> {
    void onNext(T value);

    void onError(Throwable t);

    void onCompleted();
}
