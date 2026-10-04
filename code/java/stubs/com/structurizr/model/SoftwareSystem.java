// 编译桩：仅用于验证示例语法，对应真实依赖 com.structurizr:structurizr-core
package com.structurizr.model;

public class SoftwareSystem {
    SoftwareSystem() {
    }

    public Container addContainer(String name, String description, String technology) {
        return new Container();
    }
}
